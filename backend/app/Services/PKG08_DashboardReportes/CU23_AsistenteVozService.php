<?php

namespace App\Services\PKG08_DashboardReportes;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use App\Models\PKG01_Seguridad\CU02_BitacoraAuditoria\BitacoraAuditoria;
use App\Models\PKG05_GestionCitasConcurrencia\CU10_ReservarCita\Cita;
use App\Models\PKG03_PacientesHistorial\CU06_RegistroPaciente\Paciente;
use App\Models\PKG02_MedicosEspecialidades\CU05_GestionMedicos\Medico;
use App\Models\PKG02_MedicosEspecialidades\CU04_GestionEspecialidades\Especialidad;

/**
 * Servicio CU23: Asistente IA por Voz para Reserva Rápida de Citas
 * Integra la API de Google Gemini (gemini-2.5-flash / gemini-1.5-flash)
 * con motor clínico de triaje y disponibilidad en tiempo real (PostgreSQL).
 */
class CU23_AsistenteVozService
{
    private string $timezone = 'America/La_Paz';

    /**
     * Interpreta la solicitud de voz o texto del paciente utilizando Google Gemini API
     * y busca cupos médicos disponibles en tiempo real.
     */
    public function interpretarVoz(string $mensaje, ?int $idPaciente = null): array
    {
        $mensajeLimpio = trim($mensaje);
        $apiKey = env('GEMINI_API_KEY');
        $modelo = env('GEMINI_MODEL', 'gemini-3.5-flash');

        $interpretacion = null;
        $motorUsado = 'LOCAL';

        // 1. Intentar llamar a Google Gemini API si la clave está configurada
        if (!empty($apiKey) && strlen($apiKey) > 10) {
            try {
                $interpretacion = $this->llamarGeminiApi($mensajeLimpio, $apiKey, $modelo);
                if ($interpretacion) {
                    $motorUsado = 'GEMINI_API';
                }
            } catch (\Throwable $e) {
                Log::warning("Fallo al consultar Gemini API: " . $e->getMessage() . ". Usando motor local de respaldo.");
                $interpretacion = null;
            }
        }

        // 2. Si no hay API Key o falló la llamada, usar el motor de respaldo local
        if (!$interpretacion) {
            $interpretacion = $this->motorLocalInterpretacion($mensajeLimpio);
            $motorUsado = 'MOTOR_LOCAL_RESIDUO';
        }

        // 3. Buscar cupos reales disponibles en PostgreSQL según la especialidad y turno inferido
        $cuposDisponibles = $this->buscarCuposDisponibles(
            $interpretacion['especialidad'],
            $interpretacion['turno_preferido'] ?? 'CUALQUIERA',
            $interpretacion['dia_preferido'] ?? null
        );

        // 4. Enriquecer el guión de voz final para Text-to-Speech
        $guionVozFinal = $this->generarGuionVozFinal($interpretacion, $cuposDisponibles);

        // 5. Guardar en la bitácora de conversaciones IA
        $idConversacion = null;
        try {
            $idConversacion = DB::table('ia_conversaciones')->insertGetId([
                'id_paciente'           => $idPaciente,
                'mensaje_usuario'       => $mensajeLimpio,
                'especialidad_sugerida' => $interpretacion['especialidad'],
                'sintomas_detectados'   => json_encode($interpretacion['sintomas'] ?? []),
                'preferencia_horario'   => $interpretacion['dia_preferido'] ?? null,
                'preferencia_turno'     => $interpretacion['turno_preferido'] ?? 'CUALQUIERA',
                'respuesta_voz_texto'   => $guionVozFinal,
                'opciones_encontradas'  => count($cuposDisponibles),
                'fecha_creacion'        => Carbon::now($this->timezone),
            ], 'id_conversacion');
        } catch (\Throwable $ex) {
            Log::error("Error al registrar ia_conversaciones: " . $ex->getMessage());
        }

        return [
            'id_conversacion'       => $idConversacion,
            'mensaje_original'      => $mensajeLimpio,
            'motor_ia'              => $motorUsado,
            'modelo_usado'          => $motorUsado === 'GEMINI_API' ? $modelo : 'Motor Clínico Heurístico CVS-2026',
            'especialidad'          => $interpretacion['especialidad'],
            'sintomas'              => $interpretacion['sintomas'] ?? [],
            'turno_preferido'       => $interpretacion['turno_preferido'] ?? 'CUALQUIERA',
            'dia_preferido'         => $interpretacion['dia_preferido'] ?? null,
            'urgencia'              => $interpretacion['urgencia'] ?? 'MODERADO',
            'justificacion_medica'  => $interpretacion['justificacion_medica'] ?? 'Recomendación basada en triaje asistido.',
            'guion_voz'             => $guionVozFinal,
            'cupos_disponibles'     => $cuposDisponibles,
            'total_cupos'           => count($cuposDisponibles),
            'timestamp'             => Carbon::now($this->timezone)->toIso8601String(),
        ];
    }

    /**
     * Llamada a la API REST oficial de Google Gemini (generateContent)
     */
    private function llamarGeminiApi(string $mensaje, string $apiKey, string $modelo): ?array
    {
        // Lista de especialidades reales de la clínica
        $especialidadesDisponibles = DB::table('especialidades')
            ->where('estado', 'ACTIVO')
            ->pluck('nombre')
            ->toArray();

        $listaEspStr = implode(', ', $especialidadesDisponibles);

        $systemInstruction = "Eres 'Dra. Sofía', el Asistente Médico Inteligente por Voz de 'Clínica Vida Salud' (Bolivia).
Tu objetivo es analizar el mensaje del paciente (sus síntomas, queja de salud o especialidad requerida, y el horario o día que prefiere).
Especialidades válidas en la clínica: [{$listaEspStr}].
Debes clasificar los síntomas en una de las especialidades válidas y extraer el turno ('MAÑANA', 'TARDE', o 'CUALQUIERA') y día preferido.
Genera un guión de voz muy cálido, profesional y conciso (máximo 35 palabras) para ser leído al paciente por voz.
Responde ÚNICAMENTE en formato JSON con la siguiente estructura:
{
  \"especialidad\": \"NombreExactoDeLaEspecialidad\",
  \"sintomas\": [\"sintoma1\", \"sintoma2\"],
  \"turno_preferido\": \"MAÑANA\" | \"TARDE\" | \"CUALQUIERA\",
  \"dia_preferido\": \"lunes\" | \"martes\" | \"mañana\" | null,
  \"urgencia\": \"LEVE\" | \"MODERADO\" | \"URGENTE\",
  \"justificacion_medica\": \"Explicación clínica breve del motivo de la especialidad\",
  \"guion_voz\": \"Texto corto para ser hablado por el sintetizador de voz\"
}";

        $url = "https://generativelanguage.googleapis.com/v1beta/models/{$modelo}:generateContent?key={$apiKey}";

        $response = Http::withoutVerifying()->withHeaders([
            'Content-Type' => 'application/json',
        ])->timeout(15)->post($url, [
            'contents' => [
                [
                    'role' => 'user',
                    'parts' => [
                        ['text' => "Mensaje del paciente: \"{$mensaje}\""]
                    ]
                ]
            ],
            'systemInstruction' => [
                'parts' => [
                    ['text' => $systemInstruction]
                ]
            ],
            'generationConfig' => [
                'responseMimeType' => 'application/json',
                'temperature' => 0.2,
                'maxOutputTokens' => 800,
            ]
        ]);

        if (!$response->successful()) {
            Log::warning("Gemini API respondió con código {$response->status()}: " . $response->body());
            return null;
        }

        $data = $response->json();
        $rawText = $data['candidates'][0]['content']['parts'][0]['text'] ?? null;

        if (!$rawText) {
            return null;
        }

        // Limpiar posibles bloques ```json ... ``` devueltos por LLM
        $cleanJson = preg_replace('/^```(?:json)?\s*|\s*```$/m', '', trim($rawText));
        $cleanJson = trim($cleanJson);

        $parsed = json_decode($cleanJson, true);
        if (!is_array($parsed) || empty($parsed['especialidad'])) {
            return null;
        }

        // Mapear campos alternativos devueltos por Gemini
        if (empty($parsed['guion_voz']) && !empty($parsed['respuesta'])) {
            $parsed['guion_voz'] = $parsed['respuesta'];
        }
        if (empty($parsed['turno_preferido']) && !empty($parsed['preferencia_horario'])) {
            $parsed['turno_preferido'] = $parsed['preferencia_horario'];
        }
        if (!empty($parsed['turno_preferido'])) {
            $tpUpper = mb_strtoupper($parsed['turno_preferido']);
            if (str_contains($tpUpper, 'TARDE')) $parsed['turno_preferido'] = 'TARDE';
            elseif (str_contains($tpUpper, 'MAÑANA')) $parsed['turno_preferido'] = 'MAÑANA';
            else $parsed['turno_preferido'] = 'CUALQUIERA';
        }

        // Validar que la especialidad exista en las disponibles; si no, ajustar a la más cercana o Medicina General
        $espEncontrada = null;
        foreach ($especialidadesDisponibles as $esp) {
            if (mb_stripos($esp, $parsed['especialidad']) !== false || mb_stripos($parsed['especialidad'], $esp) !== false) {
                $espEncontrada = $esp;
                break;
            }
        }
        $parsed['especialidad'] = $espEncontrada ?? 'Medicina General';

        return $parsed;
    }

    /**
     * Motor heurístico clínico local de respaldo (Triaje y NLP en Español Boliviano)
     */
    private function motorLocalInterpretacion(string $mensaje): array
    {
        $m = mb_strtolower($mensaje, 'UTF-8');

        // 1. Detección de Turno
        $turno = 'CUALQUIERA';
        if (str_contains($m, 'mañana') && !str_contains($m, 'hasta mañana') && !str_contains($m, 'pasado mañana')) {
            $turno = 'MAÑANA';
        } elseif (str_contains($m, 'tarde')) {
            $turno = 'TARDE';
        } elseif (str_contains($m, 'noche')) {
            $turno = 'TARDE'; // Las consultas vespertinas caen en bloque tarde
        }

        // 2. Detección de Día preferido
        $dias = ['lunes', 'martes', 'miércoles', 'miercoles', 'jueves', 'viernes', 'sábado', 'sabado', 'hoy', 'mañana'];
        $diaPreferido = null;
        foreach ($dias as $d) {
            if (str_contains($m, $d)) {
                $diaPreferido = $d;
                break;
            }
        }

        // 3. Reglas Clínicas de Triaje (Mapeo Síntoma -> Especialidad)
        $especialidad = 'Medicina General';
        $sintomas = [];
        $urgencia = 'MODERADO';
        $justificacion = 'Evaluación clínica inicial en Medicina General.';

        // Odontología
        if (preg_match('/muela|diente|caries|brackets|encias|encía|dental|odont|frenillo|dolor de boca/i', $m)) {
            $especialidad = 'Odontología';
            $sintomas[] = 'Molestia o dolor dental / bucodental';
            $justificacion = 'Los síntomas refieren afecciones en la cavidad oral, encías o piezas dentales.';
        }
        // Cardiología
        elseif (preg_match('/pecho|coraz[oó]n|palpitaci|presi[oó]n alta|hipertensi|arritmia|taquicardia|infarto/i', $m)) {
            $especialidad = 'Cardiología';
            $sintomas[] = 'Molestia cardiovascular / presión arterial';
            $urgencia = 'URGENTE';
            $justificacion = 'Síntomas torácicos y hemodinámicos ameritan valoración cardiológica prioritaria.';
        }
        // Pediatría
        elseif (preg_match('/niñ[oa]|bebe|bebé|hij[oa]|pequeñ[oa]|lactante|vacuna infantil|pediatra/i', $m)) {
            $especialidad = 'Pediatría';
            $sintomas[] = 'Atención médica infanto-juvenil';
            $justificacion = 'Paciente en rango de edad pediátrica para evaluación del desarrollo y salud infantil.';
        }
        // Traumatología
        elseif (preg_match('/rodilla|hueso|fractura|esguince|tobillo|hombro|articulaci|pierna|golpe|ca[ií]da|columna|espalda|lumbar/i', $m)) {
            $especialidad = 'Traumatología';
            $sintomas[] = 'Lesión osteomuscular o articular';
            $justificacion = 'Dolor o trauma en el sistema esquelético y muscular.';
        }
        // Ginecología
        elseif (preg_match('/embarazo|regla|menstrua|ginecol|ovario|p[eé]lvico|prenatal|anticonceptiv/i', $m)) {
            $especialidad = 'Ginecología';
            $sintomas[] = 'Salud reproductiva femenina / control ginecológico';
            $justificacion = 'Consulta orientada al aparato reproductor femenino y salud de la mujer.';
        }
        // Oftalmología
        elseif (preg_match('/ojo|vista|visi[oó]n|lentes|conjuntivitis|ceguera|graduaci[oó]n|catarata/i', $m)) {
            $especialidad = 'Oftalmología';
            $sintomas[] = 'Afección ocular o déficit de agudeza visual';
            $justificacion = 'Evaluación oftalmológica de agudeza visual y salud ocular.';
        }
        // Geriatría
        elseif (preg_match('/abuel[oa]|ancian[oa]|adulto mayor|demencia|memoria senil/i', $m)) {
            $especialidad = 'Geriatría';
            $sintomas[] = 'Atención geriátrica integral';
            $justificacion = 'Atención médica especializada para el adulto mayor.';
        }
        // Dermatología
        elseif (preg_match('/piel|grano|mancha|alergia piel|dermat[oó]|acne|acné|picaz[oó]n/i', $m)) {
            $especialidad = 'Dermatologia';
            $sintomas[] = 'Afección cutánea o dermatológica';
            $justificacion = 'Evaluación dermatológica de lesiones o síntomas en la piel.';
        }
        // Medicina General por defecto
        else {
            $especialidad = 'Medicina General';
            if (preg_match('/cabeza|migraña/i', $m)) $sintomas[] = 'Cefalea / dolor de cabeza';
            if (preg_match('/fiebre|temperatura/i', $m)) $sintomas[] = 'Fiebre';
            if (preg_match('/gripe|tos|resfriado/i', $m)) $sintomas[] = 'Cuadro respiratorio común';
            if (preg_match('/est[oó]mago|diarrea|n[aá]usea/i', $m)) $sintomas[] = 'Molestia digestiva';
            if (empty($sintomas)) $sintomas[] = 'Consulta clínica general';
        }

        $guionVoz = "Hola. Por los síntomas que indicas, te recomiendo agendar en {$especialidad}. He buscado los cupos disponibles.";

        return [
            'especialidad'          => $especialidad,
            'sintomas'              => $sintomas,
            'turno_preferido'       => $turno,
            'dia_preferido'         => $diaPreferido,
            'urgencia'              => $urgencia,
            'justificacion_medica'  => $justificacion,
            'guion_voz'             => $guionVoz,
        ];
    }

    /**
     * Busca cupos reales disponibles en la base de datos PostgreSQL
     */
    public function buscarCuposDisponibles(string $nombreEspecialidad, string $turnoPreferido = 'CUALQUIERA', ?string $diaPreferido = null): array
    {
        $ahoraBolivia = Carbon::now($this->timezone);

        // Buscar la especialidad
        $especialidad = Especialidad::where('estado', 'ACTIVO')
            ->where(function ($q) use ($nombreEspecialidad) {
                $q->where('nombre', 'ILIKE', "%{$nombreEspecialidad}%")
                  ->orWhere('nombre', 'ILIKE', '%' . str_replace(['í', 'á', 'é', 'ó', 'ú'], ['i', 'a', 'e', 'o', 'u'], $nombreEspecialidad) . '%');
            })->first();

        if (!$especialidad) {
            $especialidad = Especialidad::where('estado', 'ACTIVO')->first();
        }

        if (!$especialidad) {
            return [];
        }

        // Médicos con esta especialidad
        $medicos = Medico::whereHas('especialidades', function ($q) use ($especialidad) {
            $q->where('especialidades.id_especialidad', $especialidad->id_especialidad);
        })->where('estado', 'ACTIVO')->get();

        if ($medicos->isEmpty()) {
            // Fallback a cualquier médico activo
            $medicos = Medico::where('estado', 'ACTIVO')->take(2)->get();
        }

        $cupos = [];
        $diasAScanear = 7;

        for ($i = 1; $i <= $diasAScanear && count($cupos) < 4; $i++) {
            $fechaObj = $ahoraBolivia->copy()->addDays($i);
            // Ignorar domingos si la clínica descansa
            if ($fechaObj->dayOfWeekIso === 7) continue;

            $fechaStr = $fechaObj->format('Y-m-d');
            $diaSemana = $fechaObj->dayOfWeekIso; // 1: Lunes .. 6: Sábado

            foreach ($medicos as $medico) {
                // Obtener turnos de este médico para este día de la semana
                $turnos = DB::table('turnos_medicos')
                    ->where('id_medico', $medico->id_medico)
                    ->where('dia_semana', $diaSemana)
                    ->where('estado', 'ACTIVO')
                    ->get();

                foreach ($turnos as $turno) {
                    $horaInicio = Carbon::parse("{$fechaStr} {$turno->hora_inicio}", $this->timezone);
                    $horaFin = Carbon::parse("{$fechaStr} {$turno->hora_fin}", $this->timezone);
                    $bloqueMin = $turno->duracion_bloque_min ?? 15;

                    // Si el turno no calza con el turno preferido, continuar
                    $esManana = $horaInicio->hour < 13;
                    if ($turnoPreferido === 'MAÑANA' && !$esManana) continue;
                    if ($turnoPreferido === 'TARDE' && $esManana) continue;

                    // Generar un bloque candidato
                    $cursor = $horaInicio->copy();
                    while ($cursor->lt($horaFin) && count($cupos) < 4) {
                        $bloqueFin = $cursor->copy()->addMinutes($bloqueMin);
                        $horaInicioStr = $cursor->format('H:i:s');
                        $horaFinStr = $bloqueFin->format('H:i:s');

                        // Verificar si ya existe cita en ese horario
                        $citaExiste = DB::table('citas')
                            ->where('id_medico', $medico->id_medico)
                            ->where('fecha_cita', $fechaStr)
                            ->where('hora_inicio', $horaInicioStr)
                            ->whereIn('estado_cita', ['PROGRAMADA', 'CONFIRMADA', 'EN_SALA', 'ATENDIDA'])
                            ->exists();

                        if (!$citaExiste) {
                            $nombreDia = $this->obtenerNombreDia($diaSemana);
                            $cupos[] = [
                                'id_medico'         => $medico->id_medico,
                                'nombre_medico'     => "Dr(a). {$medico->nombres} {$medico->apellidos}",
                                'matricula'         => $medico->numero_registro_profesional,
                                'id_especialidad'   => $especialidad->id_especialidad,
                                'especialidad'      => $especialidad->nombre,
                                'fecha'             => $fechaStr,
                                'dia_nombre'        => $nombreDia,
                                'hora_inicio'       => substr($horaInicioStr, 0, 5),
                                'hora_fin'          => substr($horaFinStr, 0, 5),
                                'turno_label'       => $cursor->hour < 13 ? 'Mañana' : 'Tarde',
                                'etiqueta_amigable' => "{$nombreDia} {$fechaObj->format('d/m')} a las " . substr($horaInicioStr, 0, 5),
                            ];

                            // Saltar 30 minutos para ofrecer opciones distribuidas
                            $cursor->addMinutes(30);
                            break;
                        }

                        $cursor->addMinutes($bloqueMin);
                    }
                }
            }
        }

        return $cupos;
    }

    /**
     * Construye el guión de voz final natural para el sintetizador de voz (TTS)
     */
    private function generarGuionVozFinal(array $interpretacion, array $cupos): string
    {
        $esp = $interpretacion['especialidad'];
        $sintomasStr = !empty($interpretacion['sintomas']) ? implode(', ', $interpretacion['sintomas']) : '';

        if (empty($cupos)) {
            return "He evaluado tu solicitud para {$esp}. En este momento no encontré cupos directos para la preferencia indicada, pero puedes seleccionar otro día o solicitar la apertura de sobrecupo en recepción.";
        }

        $primerCupo = $cupos[0];
        $diaHora = "{$primerCupo['dia_nombre']} {$primerCupo['hora_inicio']}";
        $medico = $primerCupo['nombre_medico'];

        if (!empty($sintomasStr)) {
            return "Por los síntomas que mencionas ({$sintomasStr}), te recomiendo consultar en {$esp}. Encontré un horario disponible con {$medico} para el {$diaHora}. Presiona confirmar para apartar tu ficha.";
        }

        return "Para {$esp}, encontré disponibilidad con {$medico} el {$diaHora}. Puedes presionar el botón de reserva para confirmar tu cita ahora mismo.";
    }

    /**
     * Confirma la reserva rápida generada por la IA
     */
    public function confirmarReservaRapida(array $datos, int $idUsuario = 1): array
    {
        return DB::transaction(function () use ($datos, $idUsuario) {
            $idMedico = $datos['id_medico'];
            $idEspecialidad = $datos['id_especialidad'];
            $fechaCita = $datos['fecha_cita'];
            $horaInicio = $datos['hora_inicio'];
            $horaFin = $datos['hora_fin'] ?? Carbon::parse($horaInicio)->addMinutes(15)->format('H:i');
            $motivo = $datos['motivo_consulta'] ?? 'Reserva asistida por Inteligencia Artificial y Voz';
            $idPaciente = $datos['id_paciente'] ?? null;

            // Si no se proporcionó paciente, usar el paciente de demo por defecto (ID 1 o primer paciente activo)
            if (!$idPaciente) {
                $pacienteDefault = Paciente::where('estado', 'ACTIVO')->first();
                $idPaciente = $pacienteDefault ? $pacienteDefault->id_paciente : 1;
            }

            // Control de concurrencia: bloqueo pesimista contra colisión
            $colision = Cita::where('id_medico', $idMedico)
                ->where('fecha_cita', $fechaCita)
                ->where('hora_inicio', $horaInicio)
                ->whereIn('estado_cita', ['PROGRAMADA', 'CONFIRMADA', 'EN_SALA', 'ATENDIDA'])
                ->lockForUpdate()
                ->first();

            if ($colision) {
                return [
                    'success' => false,
                    'error'   => 'Este horario acaba de ser ocupado por otro paciente. Por favor selecciona otro cupo disponible.',
                ];
            }

            // Generar Código Único de Cita (formato CIT-YYYYMMDD-XXXX)
            $fechaNum = Carbon::parse($fechaCita)->format('Ymd');
            do {
                $randomSuffix = strtoupper(\Illuminate\Support\Str::random(4));
                $codigoCita = "CIT-{$fechaNum}-{$randomSuffix}";
            } while (Cita::where('codigo_cita', $codigoCita)->exists());

            // Crear la cita médica
            $cita = Cita::create([
                'codigo_cita'     => $codigoCita,
                'id_paciente'     => $idPaciente,
                'id_medico'       => $idMedico,
                'id_especialidad' => $idEspecialidad,
                'fecha_cita'      => $fechaCita,
                'hora_inicio'     => $horaInicio,
                'hora_fin'        => $horaFin,
                'motivo_consulta' => $motivo,
                'estado_cita'     => 'PROGRAMADA',
                'creado_por'      => $idUsuario,
            ]);

            // Generar token y registro de reserva
            $tokenReserva = 'TICK-IA-' . strtoupper(bin2hex(random_bytes(4)));
            try {
                DB::table('reservas')->insert([
                    'id_cita'          => $cita->id_cita,
                    'id_paciente'      => $idPaciente,
                    'token_reserva'    => $tokenReserva,
                    'fecha_expiracion' => Carbon::parse("{$fechaCita} {$horaInicio}", $this->timezone)->subHours(2),
                    'estado_reserva'   => 'CONFIRMADA',
                ]);
            } catch (\Throwable $e) {
                Log::warning("No se pudo insertar en reservas: " . $e->getMessage());
            }

            // Actualizar la conversación IA si viene id_conversacion
            if (!empty($datos['id_conversacion'])) {
                DB::table('ia_conversaciones')
                    ->where('id_conversacion', $datos['id_conversacion'])
                    ->update(['id_cita_generada' => $cita->id_cita]);
            }

            // Auditoría
            BitacoraAuditoria::registrar(
                'CITAS',
                'citas',
                $cita->id_cita,
                'RESERVA_IA_VOZ',
                null,
                [
                    'origen'       => 'ASISTENTE_VOZ_GEMINI',
                    'id_medico'    => $idMedico,
                    'fecha'        => $fechaCita,
                    'hora'         => $horaInicio,
                    'token_ticket' => $tokenReserva,
                ],
                $idUsuario
            );

            // Cargar relaciones para el ticket
            $cita->load(['paciente', 'medico', 'especialidad']);

            $guionConfirmacion = "¡Tu cita ha sido confirmada con éxito! Quedó agendada con {$cita->medico->nombre_completo} para el {$fechaCita} a las {$horaInicio}. Tu código de ficha es {$tokenReserva}.";

            return [
                'success'            => true,
                'mensaje'            => 'Cita médica reservada exitosamente mediante el Asistente IA.',
                'ticket_token'       => $tokenReserva,
                'cita'               => $cita,
                'guion_confirmacion' => $guionConfirmacion,
            ];
        });
    }

    /**
     * Ejemplos interactivos para probar con 1 clic
     */
    public function ejemplosGuiados(): array
    {
        return [
            [
                'icono'     => '🦷',
                'titulo'    => 'Dolor de muela y encías',
                'texto'     => 'Tengo un dolor muy fuerte de muela que no me deja dormir, quisiera una cita para la tarde',
                'esperado'  => 'Odontología (Turno Tarde)',
            ],
            [
                'icono'     => '❤️',
                'titulo'    => 'Presión alta y fatiga',
                'texto'     => 'Siento mucha agitación, palpitaciones y presión alta desde ayer en la noche',
                'esperado'  => 'Cardiología (Prioritario)',
            ],
            [
                'icono'     => '👶',
                'titulo'    => 'Chequeo de bebé / niño',
                'texto'     => 'Necesito agendar el control de vacunas de mi hijo pequeño para esta semana por la mañana',
                'esperado'  => 'Pediatría (Turno Mañana)',
            ],
            [
                'icono'     => '🦴',
                'titulo'    => 'Dolor en la rodilla tras caída',
                'texto'     => 'Me doblé la rodilla jugando fútbol y no puedo apoyar el pie, busco turno con traumatólogo',
                'esperado'  => 'Traumatología (Cualquier horario)',
            ],
            [
                'icono'     => '🩺',
                'titulo'    => 'Chequeo general / Gripe',
                'texto'     => 'Tengo fiebre y mucho dolor de cabeza, quiero consultar con medicina general mañana temprano',
                'esperado'  => 'Medicina General (Turno Mañana)',
            ],
        ];
    }

    /**
     * Guarda la API Key de Gemini en el archivo .env
     */
    public function guardarConfiguracionGemini(string $apiKey, ?string $modelo = 'gemini-2.5-flash'): bool
    {
        $path = base_path('.env');
        if (!file_exists($path)) return false;

        $content = file_get_contents($path);

        if (str_contains($content, 'GEMINI_API_KEY=')) {
            $content = preg_replace('/GEMINI_API_KEY=.*/', "GEMINI_API_KEY={$apiKey}", $content);
        } else {
            $content .= "\nGEMINI_API_KEY={$apiKey}\n";
        }

        if (str_contains($content, 'GEMINI_MODEL=')) {
            $content = preg_replace('/GEMINI_MODEL=.*/', "GEMINI_MODEL={$modelo}", $content);
        } else {
            $content .= "GEMINI_MODEL={$modelo}\n";
        }

        file_put_contents($path, $content);
        return true;
    }

    /**
     * Obtiene el estado actual del motor Gemini
     */
    public function obtenerEstadoMotor(): array
    {
        $apiKey = env('GEMINI_API_KEY');
        $tieneKey = !empty($apiKey) && strlen($apiKey) > 10;
        $modelo = env('GEMINI_MODEL', 'gemini-2.5-flash');

        $keyEnmascarada = $tieneKey
            ? substr($apiKey, 0, 6) . '...' . substr($apiKey, -4)
            : 'No configurada (Modo Local Activo)';

        return [
            'activo'            => true,
            'usa_gemini_api'    => $tieneKey,
            'motor_nombre'      => $tieneKey ? "Google Gemini API ({$modelo})" : 'Motor Heurístico Local Clínico CVS-2026',
            'modelo'            => $modelo,
            'key_enmascarada'   => $keyEnmascarada,
            'soporte_voz'       => 'Web Speech API (Síntesis y Reconocimiento de Voz en tiempo real)',
            'idioma'            => 'es-BO (Español Bolivia / Latinoamericano)',
        ];
    }

    private function obtenerNombreDia(int $diaSemana): string
    {
        $map = [
            1 => 'Lunes',
            2 => 'Martes',
            3 => 'Miércoles',
            4 => 'Jueves',
            5 => 'Viernes',
            6 => 'Sábado',
            7 => 'Domingo',
        ];
        return $map[$diaSemana] ?? 'Día';
    }
}
