<?php

namespace App\Models\PKG01_Seguridad\CU22_BackupRestore;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\PKG01_Seguridad\CU01_Autenticacion\Usuario;

class BackupLog extends Model
{
    protected $table = 'backup_logs';
    protected $primaryKey = 'id_backup';

    public $timestamps = false;

    protected $fillable = [
        'nombre_archivo',
        'tipo_backup',
        'tipo_disparo',
        'tamano_bytes',
        'tamano_formateado',
        'estado',
        'checksum_sha256',
        'ruta_almacenamiento',
        'detalles',
        'creado_por',
        'fecha_creacion',
        'fecha_restauracion',
        'restaurado_por',
    ];

    protected $casts = [
        'id_backup'          => 'integer',
        'tamano_bytes'       => 'integer',
        'creado_por'         => 'integer',
        'restaurado_por'     => 'integer',
        'fecha_creacion'     => 'datetime',
        'fecha_restauracion' => 'datetime',
        'detalles'           => 'json',
    ];

    public function creador(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'creado_por', 'id_usuario');
    }

    public function restaurador(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'restaurado_por', 'id_usuario');
    }
}
