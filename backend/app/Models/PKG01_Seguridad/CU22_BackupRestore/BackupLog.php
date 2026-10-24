<?php

namespace App\Models\PKG01_Seguridad\CU22_BackupRestore;

use Illuminate\Database\Eloquent\Model;

class BackupLog extends Model
{
    protected $table = 'backuplogs';
    protected $guarded = ['id'];
}
