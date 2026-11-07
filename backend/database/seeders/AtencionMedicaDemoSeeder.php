<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AtencionMedicaDemoSeeder extends Seeder
{
    public function run(): void
    {
        $hoy = Carbon::now('America/La_Paz')->toDateString();

        // 1. TURNO MÉDICO DEL DR. CARLOS MENDOZA (Lunes a Sábado, 08:00 a 12:00, bloques 15 min)
        for ($dia = 1; $dia <= 6; $dia++) {
            DB::table('turnos_medicos')->updateOrInsert(
                ['id_medico' => 1, 'dia_semana' => $dia, 'hora_inicio' => '08:00:00'],
                [
                    'hora_fin'            => '12:00:00',
                    'duracion_bloque_min' => 15,
                    'estado'              => 'ACTIVO',
                ]
            );
        }

        // 2. PACIENTES DE DEMO
        $pacientesData = [
            [
                'id_paciente'      => 1,
                'id_usuario'       => 4,
                'ci'               => '87654321',
                'nombres'          => 'Juan Pablo',
                'apellidos'        => 'Pérez Gómez',
                'fecha_nacimiento' => '1990-05-15',
                'sexo'             => 'MASCULINO',
                'telefono'         => '75598765',
                'email'            => 'paciente@clinicavidasalud.com',
                'direccion'        => 'Av. Las Américas #450',
                'primera_visita'   => false,
                'estado'           => 'ACTIVO',
            ],
            [
                'id_paciente'      => 2,
                'id_usuario'       => null,
                'ci'               => '65432109',
                'nombres'          => 'Andrea Sofía',
                'apellidos'        => 'Morales Paz',
                'fecha_nacimiento' => '1995-11-20',
                'sexo'             => 'FEMENINO',
                'telefono'         => '76612345',
                'email'            => 'andrea.morales@gmail.com',
                'direccion'        => 'Calle Beni #220',
                'primera_visita'   => true,
                'estado'           => 'ACTIVO',
            ],
            [
                'id_paciente'      => 3,
                'id_usuario'       => null,
                'ci'               => '43210987',
                'nombres'          => 'Carlos Rodrigo',
                'apellidos'        => 'Vargas Castro',
                'fecha_nacimiento' => '1982-03-10',
                'sexo'             => 'MASCULINO',
                'telefono'         => '71234567',
                'email'            => 'carlos.vargas@hotmail.com',
                'direccion'        => 'Barrio Equipetrol Calle 4 #12',
                'primera_visita'   => false,
                'estado'           => 'ACTIVO',
            ],
            [
                'id_paciente'      => 4,
                'id_usuario'       => null,
                'ci'               => '56789012',
                'nombres'          => 'Mariana Claudia',
                'apellidos'        => 'Roca Méndez',
                'fecha_nacimiento' => '2001-08-25',
                'sexo'             => 'FEMENINO',
                'telefono'         => '78901234',
                'email'            => 'mariana.roca@outlook.com',
                'direccion'        => 'Av. Bush esq. 2do Anillo',
                'primera_visita'   => false,
                'estado'           => 'ACTIVO',
            ],
            [
                'id_paciente'      => 5,
                'id_usuario'       => null,
                'ci'               => '78901234',
                'nombres'          => 'Jorge Luis',
                'apellidos'        => 'Mamani Flores',
                'fecha_nacimiento' => '1975-09-04',
                'sexo'             => 'MASCULINO',
                'telefono'         => '70112233',
                'email'            => 'jorge.mamani@gmail.com',
                'direccion'        => 'Plan 3000 Curva #18',
                'primera_visita'   => false,
                'estado'           => 'ACTIVO',
            ],
            [
                'id_paciente'      => 6,
                'id_usuario'       => null,
                'ci'               => '90123456',
                'nombres'          => 'Patricia Belén',
                'apellidos'        => 'Justiniano Antelo',
                'fecha_nacimiento' => '1988-12-14',
                'sexo'             => 'FEMENINO',
                'telefono'         => '77334455',
                'email'            => 'patricia.justiniano@gmail.com',
                'direccion'        => 'Av. San Martín Calle 8 #45',
                'primera_visita'   => false,
                'estado'           => 'ACTIVO',
            ],
            [
                'id_paciente'      => 7,
                'id_usuario'       => null,
                'ci'               => '32109876',
                'nombres'          => 'Gabriel Alejandro',
                'apellidos'        => 'Suárez Banegas',
                'fecha_nacimiento' => '1963-04-18',
                'sexo'             => 'MASCULINO',
                'telefono'         => '72233445',
                'email'            => 'gabriel.suarez@gmail.com',
                'direccion'        => 'Villa 1ro de Mayo Calle 12',
                'primera_visita'   => false,
                'estado'           => 'ACTIVO',
            ],
            [
                'id_paciente'      => 8,
                'id_usuario'       => null,
                'ci'               => '23456789',
                'nombres'          => 'Lucía Fernanda',
                'apellidos'        => 'Ortiz Ribera',
                'fecha_nacimiento' => '1998-07-02',
                'sexo'             => 'FEMENINO',
                'telefono'         => '73344556',
                'email'            => 'lucia.ortiz@gmail.com',
                'direccion'        => 'Av. Monseñor Rivero #310',
                'primera_visita'   => true,
                'estado'           => 'ACTIVO',
            ],
        ];

        foreach ($pacientesData as $p) {
            DB::table('pacientes')->updateOrInsert(
                ['id_paciente' => $p['id_paciente']],
                array_merge($p, [
                    'fecha_creacion'      => Carbon::now(),
                    'fecha_actualizacion' => Carbon::now(),
                ])
            );
        }

        // 3. HISTORIAS CLÍNICAS (CON DIVERSAS ALERGIAS Y TIPOS DE SANGRE)
        $historiasData = [
            [
                'id_historia_clinica'        => 1,
                'id_paciente'                => 1,
                'numero_expediente'          => 'EXP-2026-0001',
                'tipo_sangre'                => 'O+',
                'alergias_medicamentos'      => 'Penicilina G, Amoxicilina',
                'enfermedades_hereditarias'  => 'Hipertensión arterial (padre)',
                'antecedentes_patologicos'   => 'Gastritis erosiva crónica',
                'antecedentes_quirurgicos'   => 'Apendicectomía (2018)',
            ],
            [
                'id_historia_clinica'        => 2,
                'id_paciente'                => 2,
                'numero_expediente'          => 'EXP-2026-0002',
                'tipo_sangre'                => 'A+',
                'alergias_medicamentos'      => 'Sulfamidas (Trimetoprima-Sulfametoxazol)',
                'enfermedades_hereditarias'  => 'Diabetes Mellitus tipo 2',
                'antecedentes_patologicos'   => 'Rinitis alérgica estacional',
                'antecedentes_quirurgicos'   => 'Sin cirugías previas',
            ],
            [
                'id_historia_clinica'        => 3,
                'id_paciente'                => 3,
                'numero_expediente'          => 'EXP-2026-0003',
                'tipo_sangre'                => 'B+',
                'alergias_medicamentos'      => 'AINEs (Ibuprofeno, Diclofenaco, Aspirina)',
                'enfermedades_hereditarias'  => 'Cardiopatía isquémica',
                'antecedentes_patologicos'   => 'Úlcera péptica',
                'antecedentes_quirurgicos'   => 'Colecistectomía laparoscópica (2021)',
            ],
            [
                'id_historia_clinica'        => 4,
                'id_paciente'                => 4,
                'numero_expediente'          => 'EXP-2026-0004',
                'tipo_sangre'                => 'O-',
                'alergias_medicamentos'      => 'Ninguna conocida',
                'enfermedades_hereditarias'  => 'Sin antecedentes de relevancia',
                'antecedentes_patologicos'   => 'Asma bronquial en infancia (remitido)',
                'antecedentes_quirurgicos'   => 'Sin cirugías previas',
            ],
            [
                'id_historia_clinica'        => 5,
                'id_paciente'                => 5,
                'numero_expediente'          => 'EXP-2026-0005',
                'tipo_sangre'                => 'AB+',
                'alergias_medicamentos'      => 'Eritromicina, Azitromicina',
                'enfermedades_hereditarias'  => 'Hipertensión y ACV',
                'antecedentes_patologicos'   => 'Dislipidemia mixta',
                'antecedentes_quirurgicos'   => 'Reducción de fractura de fémur (2015)',
            ],
            [
                'id_historia_clinica'        => 6,
                'id_paciente'                => 6,
                'numero_expediente'          => 'EXP-2026-0006',
                'tipo_sangre'                => 'O+',
                'alergias_medicamentos'      => 'Ninguna conocida',
                'enfermedades_hereditarias'  => 'Cáncer de mama (abuela)',
                'antecedentes_patologicos'   => 'Hipotiroidismo primario en tratamiento',
                'antecedentes_quirurgicos'   => 'Cesárea (2020)',
            ],
            [
                'id_historia_clinica'        => 7,
                'id_paciente'                => 7,
                'numero_expediente'          => 'EXP-2026-0007',
                'tipo_sangre'                => 'A-',
                'alergias_medicamentos'      => 'Dipirona (Metamizol)',
                'enfermedades_hereditarias'  => 'Glaucoma de ángulo abierto',
                'antecedentes_patologicos'   => 'Hipertensión arterial estadio 2',
                'antecedentes_quirurgicos'   => 'Hernioplastia inguinal derecha (2010)',
            ],
            [
                'id_historia_clinica'        => 8,
                'id_paciente'                => 8,
                'numero_expediente'          => 'EXP-2026-0008',
                'tipo_sangre'                => 'B-',
                'alergias_medicamentos'      => 'Ninguna conocida',
                'enfermedades_hereditarias'  => 'Sin antecedentes patológicos familiares',
                'antecedentes_patologicos'   => 'Migraña con aura',
                'antecedentes_quirurgicos'   => 'Sin cirugías previas',
            ],
        ];

        foreach ($historiasData as $h) {
            DB::table('historias_clinicas')->updateOrInsert(
                ['id_historia_clinica' => $h['id_historia_clinica']],
                array_merge($h, [
                    'fecha_apertura'      => Carbon::now()->subMonths(6),
                    'fecha_actualizacion' => Carbon::now(),
                ])
            );
        }

        // 4. CONTACTOS DE EMERGENCIA
        $contactos = [
            ['id_contacto' => 1, 'id_paciente' => 1, 'nombre_completo' => 'Elena Gómez', 'parentesco' => 'Madre', 'telefono' => '70099887'],
            ['id_contacto' => 2, 'id_paciente' => 2, 'nombre_completo' => 'Roberto Morales', 'parentesco' => 'Padre', 'telefono' => '70122334'],
            ['id_contacto' => 3, 'id_paciente' => 3, 'nombre_completo' => 'Daniela Castro', 'parentesco' => 'Esposa', 'telefono' => '70233445'],
            ['id_contacto' => 4, 'id_paciente' => 4, 'nombre_completo' => 'Martín Roca', 'parentesco' => 'Hermano', 'telefono' => '70344556'],
        ];

        foreach ($contactos as $c) {
            DB::table('contactos_emergencia')->updateOrInsert(
                ['id_contacto' => $c['id_contacto']],
                $c
            );
        }

        // 5. CITAS DE LA JORNADA DE HOY EN BLOQUES DE 15 MINUTOS (CU15)
        $citasHoy = [
            [
                'id_cita'         => 1,
                'codigo_cita'     => 'CITA-' . date('Ymd') . '-001',
                'id_paciente'     => 1,
                'id_medico'       => 1,
                'id_especialidad' => 1,
                'fecha_cita'      => $hoy,
                'hora_inicio'     => '08:00:00',
                'hora_fin'        => '08:15:00',
                'motivo_consulta' => 'Control de presión arterial y cefalea matutina',
                'estado_cita'     => 'ATENDIDA',
                'creado_por'      => 2,
            ],
            [
                'id_cita'         => 2,
                'codigo_cita'     => 'CITA-' . date('Ymd') . '-002',
                'id_paciente'     => 2,
                'id_medico'       => 1,
                'id_especialidad' => 1,
                'fecha_cita'      => $hoy,
                'hora_inicio'     => '08:15:00',
                'hora_fin'        => '08:30:00',
                'motivo_consulta' => 'Cuadro febril de 48 horas, odinofagia y tos seca',
                'estado_cita'     => 'EN_ESPERA',
                'creado_por'      => 2,
            ],
            [
                'id_cita'         => 3,
                'codigo_cita'     => 'CITA-' . date('Ymd') . '-003',
                'id_paciente'     => 3,
                'id_medico'       => 1,
                'id_especialidad' => 1,
                'fecha_cita'      => $hoy,
                'hora_inicio'     => '08:30:00',
                'hora_fin'        => '08:45:00',
                'motivo_consulta' => 'Dolor epigástrico urente postprandial y pirosis',
                'estado_cita'     => 'CONFIRMADA',
                'creado_por'      => 2,
            ],
            [
                'id_cita'         => 4,
                'codigo_cita'     => 'CITA-' . date('Ymd') . '-004',
                'id_paciente'     => 4,
                'id_medico'       => 1,
                'id_especialidad' => 1,
                'fecha_cita'      => $hoy,
                'hora_inicio'     => '08:45:00',
                'hora_fin'        => '09:00:00',
                'motivo_consulta' => 'Revisión médica general y chequeo preventivo',
                'estado_cita'     => 'CONFIRMADA',
                'creado_por'      => 2,
            ],
            [
                'id_cita'         => 5,
                'codigo_cita'     => 'CITA-' . date('Ymd') . '-005',
                'id_paciente'     => 5,
                'id_medico'       => 1,
                'id_especialidad' => 1,
                'fecha_cita'      => $hoy,
                'hora_inicio'     => '09:00:00',
                'hora_fin'        => '09:15:00',
                'motivo_consulta' => 'Evaluación de dolor lumbar irradiado a extremidad',
                'estado_cita'     => 'PROGRAMADA',
                'creado_por'      => 2,
            ],
            [
                'id_cita'         => 6,
                'codigo_cita'     => 'CITA-' . date('Ymd') . '-006',
                'id_paciente'     => 6,
                'id_medico'       => 1,
                'id_especialidad' => 1,
                'fecha_cita'      => $hoy,
                'hora_inicio'     => '09:15:00',
                'hora_fin'        => '09:30:00',
                'motivo_consulta' => 'Control rutinario de función tiroidea y fatiga',
                'estado_cita'     => 'PROGRAMADA',
                'creado_por'      => 2,
            ],
            [
                'id_cita'         => 7,
                'codigo_cita'     => 'CITA-' . date('Ymd') . '-007',
                'id_paciente'     => 7,
                'id_medico'       => 1,
                'id_especialidad' => 1,
                'fecha_cita'      => $hoy,
                'hora_inicio'     => '09:30:00',
                'hora_fin'        => '09:45:00',
                'motivo_consulta' => 'Ajuste de dosis antihipertensiva y edema leve',
                'estado_cita'     => 'PROGRAMADA',
                'creado_por'      => 2,
            ],
            [
                'id_cita'         => 8,
                'codigo_cita'     => 'CITA-' . date('Ymd') . '-008',
                'id_paciente'     => 8,
                'id_medico'       => 1,
                'id_especialidad' => 1,
                'fecha_cita'      => $hoy,
                'hora_inicio'     => '09:45:00',
                'hora_fin'        => '10:00:00',
                'motivo_consulta' => 'Episodio recurrente de cefalea hemicraneal pulsátil',
                'estado_cita'     => 'PROGRAMADA',
                'creado_por'      => 2,
            ],
        ];

        foreach ($citasHoy as $c) {
            DB::table('citas')->updateOrInsert(
                ['id_cita' => $c['id_cita']],
                array_merge($c, [
                    'fecha_creacion'      => Carbon::now()->subHours(2),
                    'fecha_actualizacion' => Carbon::now(),
                ])
            );
        }

        // 6. ATENCIÓN MÉDICA DE EJEMPLO PARA LA CITA 1
        DB::table('atenciones_medicas')->updateOrInsert(
            ['id_cita' => 1],
            [
                'id_atencion'             => 1,
                'id_historia_clinica'     => 1,
                'id_medico'               => 1,
                'motivo_consulta'         => 'Control de presión arterial y cefalea matutina',
                'sintomas'                => 'Paciente refiere cefalea holocraneal opresiva intermitente de 3 días de evolución, sin fotofobia.',
                'signos_vitales'          => json_encode([
                    'presion_arterial'     => '145/95 mmHg',
                    'frecuencia_cardiaca'  => '78 lpm',
                    'temperatura'          => '36.6 °C',
                    'saturacion_oxigeno'   => '98 %',
                    'peso'                 => '82 kg',
                    'talla'                => '175 cm',
                    'imc'                  => '26.8',
                ]),
                'diagnostico_cie10'       => 'I10',
                'diagnostico_descripcion' => 'Hipertensión esencial (primaria) descompensada leve',
                'tratamiento'             => 'Ajuste de dosis antihipertensiva. Dieta hiposódica estricta y caminatas de 30 min diarias.',
                'receta_medica'           => "1. Losartán Potásico 50mg - 1 comprimido cada 12 horas por 30 días.\n2. Hidroclorotiazida 12.5mg - 1 comprimido en la mañana por 30 días.",
                'derivacion_especialidad' => 'Cardiología (control semestral)',
                'fecha_atencion'          => Carbon::now('America/La_Paz')->subHours(1),
                'fecha_creacion'          => Carbon::now('America/La_Paz')->subHours(1),
            ]
        );

        // 7. ESTUDIOS DE LABORATORIO DE DEMO
        $laboratorios = [
            [
                'id_estudio'            => 1,
                'codigo_estudio'        => 'LAB-20261020-0012',
                'id_paciente'           => 1,
                'id_medico_solicitante' => 1,
                'id_cita'               => 1,
                'nombre_estudio'        => 'Perfil Lipídico y Función Renal',
                'tipo_estudio'          => 'Laboratorio Clínico',
                'descripcion'           => 'Colesterol total, Triglicéridos, HDL, LDL, Creatinina y Urea',
                'fecha_solicitud'       => Carbon::now()->subDays(5),
                'estado'                => 'PUBLICADO',
                'resultado_diagnostico' => 'Colesterol Total: 220 mg/dL (Elevado), Triglicéridos: 185 mg/dL, HDL: 42 mg/dL, LDL: 141 mg/dL. Creatinina: 0.9 mg/dL (Normal).',
                'archivo_resultado_url' => '/laboratorios/resultados/exp_0001_lipidos.pdf',
                'publicado_en'          => Carbon::now()->subDays(2),
            ],
            [
                'id_estudio'            => 2,
                'codigo_estudio'        => 'LAB-20261022-0034',
                'id_paciente'           => 2,
                'id_medico_solicitante' => 1,
                'id_cita'               => 2,
                'nombre_estudio'        => 'Hemograma Completo y PCR Cuantitativa',
                'tipo_estudio'          => 'Laboratorio Clínico',
                'descripcion'           => 'Control por cuadro febril',
                'fecha_solicitud'       => Carbon::now()->subDays(1),
                'estado'                => 'PUBLICADO',
                'resultado_diagnostico' => 'Leucocitos: 11,800 /mm3 (Leucocitosis leve con neutrofilia 76%), Hb: 13.8 g/dL, Plaquetas: 245,000 /mm3, PCR: 18 mg/L (Positivo leve).',
                'archivo_resultado_url' => '/laboratorios/resultados/exp_0002_hemograma.pdf',
                'publicado_en'          => Carbon::now()->subHours(6),
            ],
            [
                'id_estudio'            => 3,
                'codigo_estudio'        => 'LAB-20261023-0056',
                'id_paciente'           => 3,
                'id_medico_solicitante' => 1,
                'id_cita'               => 3,
                'nombre_estudio'        => 'Endoscopia Digestiva Alta y Test de Ureasa',
                'tipo_estudio'          => 'Gastroenterología / Imagen',
                'descripcion'           => 'Sospecha de infección por Helicobacter Pylori',
                'fecha_solicitud'       => Carbon::now()->subDays(3),
                'estado'                => 'PENDIENTE',
                'resultado_diagnostico' => null,
                'archivo_resultado_url' => null,
                'publicado_en'          => null,
            ],
        ];

        foreach ($laboratorios as $lab) {
            DB::table('laboratorios_estudios')->updateOrInsert(
                ['id_estudio' => $lab['id_estudio']],
                $lab
            );
        }
    }
}

