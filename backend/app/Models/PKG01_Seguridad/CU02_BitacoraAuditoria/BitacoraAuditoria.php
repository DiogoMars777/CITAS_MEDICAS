<?php

namespace App\Models\PKG01_Seguridad\CU02_BitacoraAuditoria;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use App\Models\PKG01_Seguridad\CU01_Autenticacion\Usuario;

class BitacoraAuditoria extends Model
{
    protected $table = 'bitacora_auditoria';
    protected $primaryKey = 'id_bitacora';
    public $timestamps = false;

    protected $fillable = [
        'id_usuario',
        'modulo',
        'tabla_afectada',
        'id_registro_afectado',
        'operacion',
        'valores_anteriores',
        'valores_nuevos',
        'direccion_ip',
        'user_agent',
        'fecha_creacion',
    ];

    protected $casts = [
        'valores_anteriores' => 'array',
        'valores_nuevos'     => 'array',
        'fecha_creacion'     => 'datetime',
    ];

    protected $appends = [
        'fecha_bolivia',
    ];

    /**
     * Formateador de Fecha y Hora Boliviana (America/La_Paz - UTC-4)
     */
    public function getFechaBoliviaAttribute(): string
    {
        if (!$this->fecha_creacion) {
            return Carbon::now('America/La_Paz')->format('d/m/Y H:i:s') . ' BOT';
        }

        return Carbon::parse($this->fecha_creacion)
            ->setTimezone('America/La_Paz')
            ->format('d/m/Y H:i:s') . ' BOT';
    }

    /**
     * Relación con el Usuario que ejecutó la acción
     */
    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario', 'id_usuario');
    }

    /**
     * Método estático helper para registrar eventos de auditoría de forma centralizada
     */
    public static function registrar(
        string $modulo,
        string $tablaAfectada,
        int $idRegistroAfectado,
        string $operacion,
        ?array $valoresAnteriores = null,
        ?array $valoresNuevos = null,
        ?int $idUsuario = null,
        ?string $ip = null,
        ?string $userAgent = null
    ): self {
        return self::create([
            'id_usuario'           => $idUsuario,
            'modulo'               => strtoupper($modulo),
            'tabla_afectada'       => strtolower($tablaAfectada),
            'id_registro_afectado' => $idRegistroAfectado,
            'operacion'            => strtoupper($operacion),
            'valores_anteriores'   => $valoresAnteriores,
            'valores_nuevos'       => $valoresNuevos,
            'direccion_ip'         => $ip ?? request()->ip(),
            'user_agent'           => $userAgent ?? request()->userAgent(),
            'fecha_creacion'       => Carbon::now('America/La_Paz'),
        ]);
    }
}
