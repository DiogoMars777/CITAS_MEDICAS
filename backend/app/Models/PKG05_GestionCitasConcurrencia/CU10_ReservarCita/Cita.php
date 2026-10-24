<?php

namespace App\Models\PKG05_GestionCitasConcurrencia\CU10_ReservarCita;

use Illuminate\Database\Eloquent\Model;
use App\Models\PKG03_PacientesHistorial\CU06_RegistroPaciente\Paciente;
use App\Models\PKG02_MedicosEspecialidades\CU05_GestionMedicos\Medico;
use App\Models\PKG02_MedicosEspecialidades\CU04_GestionEspecialidades\Especialidad;
use App\Models\PKG01_Seguridad\CU01_Autenticacion\Usuario;

class Cita extends Model
{
    protected $table = 'citas';
    protected $primaryKey = 'id_cita';

    public $timestamps = true;
    const CREATED_AT = 'fecha_creacion';
    const UPDATED_AT = 'fecha_actualizacion';

    protected $fillable = [
        'codigo_cita',
        'id_paciente',
        'id_medico',
        'id_especialidad',
        'fecha_cita',
        'hora_inicio',
        'hora_fin',
        'motivo_consulta',
        'estado_cita',
        'creado_por',
    ];

    protected $casts = [
        'fecha_cita' => 'date:Y-m-d',
    ];

    /**
     * Paciente asociado
     */
    public function paciente()
    {
        return $this->belongsTo(Paciente::class, 'id_paciente', 'id_paciente');
    }

    /**
     * Médico que atiende
     */
    public function medico()
    {
        return $this->belongsTo(Medico::class, 'id_medico', 'id_medico');
    }

    /**
     * Especialidad de la consulta
     */
    public function especialidad()
    {
        return $this->belongsTo(Especialidad::class, 'id_especialidad', 'id_especialidad');
    }

    /**
     * Usuario que registró la cita
     */
    public function creador()
    {
        return $this->belongsTo(Usuario::class, 'creado_por', 'id_usuario');
    }
}
