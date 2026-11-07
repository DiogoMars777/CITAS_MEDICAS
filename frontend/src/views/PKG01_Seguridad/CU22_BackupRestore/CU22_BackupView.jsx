import React, { useState, useEffect } from 'react';
import {
  Database,
  ShieldCheck,
  Download,
  RotateCcw,
  Trash2,
  RefreshCw,
  Server,
  FileCode,
  HardDrive,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  Lock,
  Hash,
  Eye,
  Layers,
  Settings,
  Play,
  Save,
  Check,
  Mail,
  Sliders,
  History,
  Timer,
  Info,
} from 'lucide-react';
import useCU22BackupRestoreController from '../../../controllers/PKG01_Seguridad/CU22_BackupRestore/CU22_BackupRestoreController';
import {
  TIPOS_BACKUP,
  TIPOS_DISPARO,
  FRECUENCIAS_PROGRAMACION,
  DIAS_SEMANA,
} from '../../../models/PKG01_Seguridad/CU22_BackupRestore/BackupModel';

export const CU22_BackupView = () => {
  const {
    backups,
    kpis,
    estadoSistema,
    configuracion,
    loading,
    loadingConfig,
    generando,
    guardandoConfig,
    ejecutandoProgramado,
    restaurando,
    error,
    mensajeExito,
    limpiarMensajes,
    tipoFiltro,
    setTipoFiltro,
    disparoFiltro,
    setDisparoFiltro,
    pestañaActiva,
    setPestañaActiva,
    modalRestaurar,
    setModalRestaurar,
    modalDetalles,
    setModalDetalles,
    recargar,
    generarBackup,
    guardarConfiguracion,
    ejecutarJobProgramado,
    descargarBackup,
    ejecutarRestauracion,
    eliminarBackup,
  } = useCU22BackupRestoreController();

  // Estado local para edición del formulario de programación
  const [formConfig, setFormConfig] = useState({
    habilitado: true,
    frecuencia: 'DIARIO',
    dia_semana: 1,
    dia_mes: 1,
    hora_ejecucion: '02:00',
    tipo_backup: 'COMPLETO',
    retencion_dias: 30,
    limite_archivos: 10,
    email_notificacion: 'admin@clinicavidasalud.com',
  });

  // Sincronizar formConfig cuando cargue configuracion del backend
  useEffect(() => {
    if (configuracion) {
      setFormConfig({
        habilitado: configuracion.habilitado ?? true,
        frecuencia: configuracion.frecuencia || 'DIARIO',
        dia_semana: configuracion.dia_semana || 1,
        dia_mes: configuracion.dia_mes || 1,
        hora_ejecucion: configuracion.hora_ejecucion || '02:00',
        tipo_backup: configuracion.tipo_backup || 'COMPLETO',
        retencion_dias: configuracion.retencion_dias ?? 30,
        limite_archivos: configuracion.limite_archivos ?? 10,
        email_notificacion: configuracion.email_notificacion || 'admin@clinicavidasalud.com',
      });
    }
  }, [configuracion]);

  const [confirmacionTexto, setConfirmacionTexto] = useState('');

  const toggleHabilitadoDirecto = (nuevoEstado) => {
    const nuevaConfig = { ...formConfig, habilitado: nuevoEstado };
    setFormConfig(nuevaConfig);
    guardarConfiguracion(nuevaConfig);
  };

  const handleSubmitConfig = (e) => {
    e.preventDefault();
    guardarConfiguracion(formConfig);
  };

  return (
    <div style={{ padding: '0.5rem 1rem 3rem', maxWidth: '1440px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* =========================================================================
          1. CABECERA PRINCIPAL DEL MÓDULO DE BACKUPS
      ========================================================================= */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.25rem',
        background: '#ffffff',
        padding: '1.15rem 1.35rem',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 10px rgba(2, 132, 199, 0.25)',
            flexShrink: 0,
          }}>
            <Database size={24} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{
                background: '#0284c7',
                color: '#ffffff',
                fontSize: '0.68rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '4px',
                fontFamily: 'monospace',
              }}>
                CU22
              </span>
              <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                Copias de Seguridad y Restauración (Backup & Restore)
              </h1>
              <span style={{
                background: '#ecfdf5',
                color: '#059669',
                border: '1px solid #a7f3d0',
                fontSize: '0.68rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '9999px',
              }}>
                Mantenimiento Crítico
              </span>
            </div>
            <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: '#64748b' }}>
              Volcados SQL manuales y automatización con Cron/Scheduler diario, semanal o mensual con verificación criptográfica SHA-256.
            </p>
          </div>
        </div>

        {/* BOTONES DE DISPARO RÁPIDO DE BACKUP Y RECARGA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={recargar}
            disabled={loading || loadingConfig}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#f8fafc',
              color: '#334155',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: (loading || loadingConfig) ? 'not-allowed' : 'pointer',
            }}
            title="Actualizar lista y estado"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refrescar</span>
          </button>

          <button
            type="button"
            onClick={() => generarBackup(TIPOS_BACKUP.COMPLETO)}
            disabled={generando || loading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.55rem 0.95rem',
              borderRadius: '8px',
              border: 'none',
              background: generando ? '#94a3b8' : 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#ffffff',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: generando ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 6px rgba(2, 132, 199, 0.3)',
            }}
          >
            <Database size={15} />
            <span>{generando ? 'Generando Volcado...' : 'Hacer Backup Manual Ahora'}</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          2. NOTIFICACIONES DE ÉXITO O ERROR
      ========================================================================= */}
      {mensajeExito && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#f0fdf4',
          border: '1px solid #86efac',
          borderRadius: '10px',
          padding: '0.75rem 1rem',
          marginBottom: '1rem',
          color: '#166534',
          fontSize: '0.82rem',
          fontWeight: 600,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <CheckCircle2 size={18} color="#16a34a" />
            <span>{mensajeExito}</span>
          </div>
          <button
            type="button"
            onClick={limpiarMensajes}
            style={{ background: 'transparent', border: 'none', color: '#166534', cursor: 'pointer', fontWeight: 800 }}
          >
            ✕
          </button>
        </div>
      )}

      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#fef2f2',
          border: '1px solid #fca5a5',
          borderRadius: '10px',
          padding: '0.75rem 1rem',
          marginBottom: '1rem',
          color: '#991b1b',
          fontSize: '0.82rem',
          fontWeight: 600,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <AlertTriangle size={18} color="#dc2626" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={limpiarMensajes}
            style={{ background: 'transparent', border: 'none', color: '#991b1b', cursor: 'pointer', fontWeight: 800 }}
          >
            ✕
          </button>
        </div>
      )}

      {/* =========================================================================
          3. PESTAÑAS DE NAVEGACIÓN (TABS SENIOR)
      ========================================================================= */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        borderBottom: '2px solid #e2e8f0',
        marginBottom: '1.25rem',
        paddingBottom: '2px',
      }}>
        <button
          type="button"
          onClick={() => setPestañaActiva('HISTORIAL')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1.1rem',
            border: 'none',
            borderBottom: pestañaActiva === 'HISTORIAL' ? '3px solid #0284c7' : '3px solid transparent',
            background: pestañaActiva === 'HISTORIAL' ? '#e0f2fe' : 'transparent',
            color: pestañaActiva === 'HISTORIAL' ? '#0369a1' : '#64748b',
            borderRadius: '8px 8px 0 0',
            fontSize: '0.84rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <History size={16} />
          <span>Historial de Respaldos ({backups.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setPestañaActiva('PROGRAMACION')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1.1rem',
            border: 'none',
            borderBottom: pestañaActiva === 'PROGRAMACION' ? '3px solid #0284c7' : '3px solid transparent',
            background: pestañaActiva === 'PROGRAMACION' ? '#e0f2fe' : 'transparent',
            color: pestañaActiva === 'PROGRAMACION' ? '#0369a1' : '#64748b',
            borderRadius: '8px 8px 0 0',
            fontSize: '0.84rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <Timer size={16} />
          <span>Programación Automática (Cron / Scheduler)</span>
          <span style={{
            fontSize: '0.65rem',
            padding: '1px 6px',
            borderRadius: '9999px',
            background: configuracion?.habilitado ? '#dcfce7' : '#f1f5f9',
            color: configuracion?.habilitado ? '#166534' : '#64748b',
            fontWeight: 800,
          }}>
            {configuracion?.habilitado ? 'ACTIVA' : 'INACTIVA'}
          </span>
        </button>
      </div>

      {/* =========================================================================
          4. TARJETAS DE KPIS Y ESTADO DEL SISTEMA
      ========================================================================= */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '0.9rem',
        marginBottom: '1.25rem',
      }}>
        {/* KPI 1: Total de Copias */}
        <div style={{
          background: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '8px',
            background: '#e0f2fe',
            color: '#0284c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Database size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Total Respaldos</span>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>
              {kpis?.total_backups ?? backups.length}
            </div>
            <span style={{ fontSize: '0.68rem', color: '#0369a1', fontWeight: 600 }}>
              {kpis?.total_manuales ?? 0} manuales • {kpis?.total_programados ?? 0} automáticos
            </span>
          </div>
        </div>

        {/* KPI 2: Próximo Respaldo Automático */}
        <div style={{
          background: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '8px',
            background: configuracion?.habilitado ? '#ecfdf5' : '#f8fafc',
            color: configuracion?.habilitado ? '#059669' : '#94a3b8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Clock size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Próximo Automático</span>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: configuracion?.habilitado ? '#065f46' : '#94a3b8' }}>
              {configuracion?.habilitado
                ? (configuracion?.proximo_respaldo_at || 'Calculando...')
                : 'Programación en Pausa'}
            </div>
            <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>
              Frecuencia: {configuracion?.frecuencia || 'DIARIO'} ({configuracion?.hora_ejecucion || '02:00'} BOT)
            </span>
          </div>
        </div>

        {/* KPI 3: Espacio Ocupado */}
        <div style={{
          background: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '8px',
            background: '#f1f5f9',
            color: '#475569',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <HardDrive size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Espacio en Disco</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
              {kpis?.espacio_ocupado ?? '0 KB'}
            </div>
            <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>
              Base de Datos: {estadoSistema?.base_datos || 'clinica_vida_salud'}
            </span>
          </div>
        </div>

        {/* KPI 4: Estado del Motor PostgreSQL */}
        <div style={{
          background: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '8px',
            background: '#ecfdf5',
            color: '#059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Server size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Motor y Conectividad</span>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#065f46' }}>
              {estadoSistema?.motor || 'POSTGRESQL'} • Conectado
            </div>
            <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>
              {estadoSistema?.total_tablas ?? 23} tablas verificadas
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          CONTENIDO SEGÚN LA PESTAÑA ACTIVA
      ========================================================================= */}

      {/* -------------------------------------------------------------------------
          PESTAÑA 1: HISTORIAL DE RESPALDOS Y VOLCADOS MANUALES
      ------------------------------------------------------------------------- */}
      {pestañaActiva === 'HISTORIAL' && (
        <>
          {/* PANEL DE MODALIDADES DE RESPALDO MANUAL */}
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '1.25rem',
            marginBottom: '1.25rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h2 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Generar Copia de Seguridad Manual Inmediata
                </h2>
                <p style={{ margin: '2px 0 0', fontSize: '0.76rem', color: '#64748b' }}>
                  Seleccione el alcance deseado para emitir un volcado SQL auditable con verificación de integridad.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => generarBackup(TIPOS_BACKUP.COMPLETO)}
                  disabled={generando || loading}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.48rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid #0284c7',
                    background: '#0284c7',
                    color: '#ffffff',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: generando ? 'not-allowed' : 'pointer',
                  }}
                >
                  <Database size={14} />
                  <span>Completo (DDL + Datos)</span>
                </button>

                <button
                  type="button"
                  onClick={() => generarBackup(TIPOS_BACKUP.SOLO_DATOS)}
                  disabled={generando || loading}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.48rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    color: '#334155',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: generando ? 'not-allowed' : 'pointer',
                  }}
                >
                  <Layers size={14} />
                  <span>Solo Datos (INSERTS)</span>
                </button>

                <button
                  type="button"
                  onClick={() => generarBackup(TIPOS_BACKUP.SOLO_ESTRUCTURA)}
                  disabled={generando || loading}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.48rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    color: '#334155',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: generando ? 'not-allowed' : 'pointer',
                  }}
                >
                  <FileCode size={14} />
                  <span>Solo Estructura (DDL)</span>
                </button>
              </div>
            </div>
          </div>

          {/* FILTROS Y TABLA DE HISTORIAL DE RESPALDOS */}
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
            overflow: 'hidden',
          }}>
            {/* Barra de Filtros */}
            <div style={{
              padding: '0.9rem 1.25rem',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.8rem',
              background: '#f8fafc',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#475569' }}>Alcance:</span>
                {['TODOS', 'COMPLETO', 'SOLO_DATOS', 'SOLO_ESTRUCTURA'].map((tipo) => (
                  <button
                    key={tipo}
                    type="button"
                    onClick={() => setTipoFiltro(tipo)}
                    style={{
                      padding: '0.28rem 0.65rem',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      border: tipoFiltro === tipo ? '1px solid #0284c7' : '1px solid #cbd5e1',
                      background: tipoFiltro === tipo ? '#0284c7' : '#ffffff',
                      color: tipoFiltro === tipo ? '#ffffff' : '#475569',
                      cursor: 'pointer',
                    }}
                  >
                    {tipo}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#475569' }}>Disparo:</span>
                {[
                  { id: 'TODOS', label: 'Todos' },
                  { id: 'MANUAL', label: 'Manuales' },
                  { id: 'PROGRAMADO', label: 'Automáticos' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDisparoFiltro(item.id)}
                    style={{
                      padding: '0.28rem 0.65rem',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      border: disparoFiltro === item.id ? '1px solid #0284c7' : '1px solid #cbd5e1',
                      background: disparoFiltro === item.id ? '#0284c7' : '#ffffff',
                      color: disparoFiltro === item.id ? '#ffffff' : '#475569',
                      cursor: 'pointer',
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* TABLA DE RESPALDOS */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.78rem' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800 }}>Nombre del Archivo SQL</th>
                    <th style={{ padding: '0.75rem 0.85rem', fontWeight: 800 }}>Tipo y Disparo</th>
                    <th style={{ padding: '0.75rem 0.85rem', fontWeight: 800 }}>Tamaño</th>
                    <th style={{ padding: '0.75rem 0.85rem', fontWeight: 800 }}>Integridad SHA-256</th>
                    <th style={{ padding: '0.75rem 0.85rem', fontWeight: 800 }}>Estado</th>
                    <th style={{ padding: '0.75rem 0.85rem', fontWeight: 800 }}>Fecha y Creador</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 800, textAlign: 'right' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {backups.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: '3rem 1rem', textAlign: 'center', color: '#94a3b8' }}>
                        <Database size={36} color="#cbd5e1" style={{ marginBottom: '0.5rem' }} />
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#475569' }}>
                          No se encontraron copias de seguridad registradas
                        </div>
                        <p style={{ margin: '4px 0 0', fontSize: '0.78rem' }}>
                          Utilice los botones superiores para generar el primer volcado SQL de la base de datos.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    backups.map((b) => (
                      <tr
                        key={b.id_backup}
                        style={{
                          borderBottom: '1px solid #f1f5f9',
                          transition: 'background 0.15s ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; }}
                      >
                        {/* Archivo */}
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#0f172a' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FileCode size={16} color="#0284c7" />
                            <span style={{ fontFamily: 'monospace', fontSize: '0.76rem' }}>{b.nombre_archivo}</span>
                          </div>
                        </td>

                        {/* Tipo y Disparo */}
                        <td style={{ padding: '0.75rem 0.85rem' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                            <span style={{
                              display: 'inline-block',
                              padding: '2px 7px',
                              borderRadius: '4px',
                              fontSize: '0.66rem',
                              fontWeight: 800,
                              background: '#e0f2fe',
                              color: '#0369a1',
                              width: 'fit-content',
                            }}>
                              {b.tipo_backup}
                            </span>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px',
                              padding: '1px 6px',
                              borderRadius: '4px',
                              fontSize: '0.62rem',
                              fontWeight: 700,
                              background: b.tipo_disparo === 'PROGRAMADO' ? '#ecfdf5' : '#f1f5f9',
                              color: b.tipo_disparo === 'PROGRAMADO' ? '#065f46' : '#475569',
                              border: b.tipo_disparo === 'PROGRAMADO' ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
                              width: 'fit-content',
                            }}>
                              {b.tipo_disparo === 'PROGRAMADO' ? <Timer size={10} /> : <Sliders size={10} />}
                              <span>{b.tipo_disparo === 'PROGRAMADO' ? 'AUTOMÁTICO' : 'MANUAL'}</span>
                            </span>
                          </div>
                        </td>

                        {/* Tamaño */}
                        <td style={{ padding: '0.75rem 0.85rem', fontWeight: 700, color: '#334155' }}>
                          {b.tamano_formateado}
                        </td>

                        {/* SHA-256 */}
                        <td style={{ padding: '0.75rem 0.85rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Hash size={13} color="#64748b" />
                            <span
                              style={{
                                fontFamily: 'monospace',
                                fontSize: '0.68rem',
                                color: '#475569',
                                background: '#f1f5f9',
                                padding: '2px 5px',
                                borderRadius: '4px',
                              }}
                              title={b.checksum_sha256}
                            >
                              {b.checksum_sha256 ? b.checksum_sha256.substring(0, 12) + '...' : 'N/A'}
                            </span>
                          </div>
                        </td>

                        {/* Estado */}
                        <td style={{ padding: '0.75rem 0.85rem' }}>
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: '9999px',
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            background: b.estado === 'RESTAURADO' ? '#fef3c7' : '#ecfdf5',
                            color: b.estado === 'RESTAURADO' ? '#92400e' : '#065f46',
                            border: b.estado === 'RESTAURADO' ? '1px solid #fde68a' : '1px solid #a7f3d0',
                          }}>
                            {b.estado}
                          </span>
                        </td>

                        {/* Fecha y Creador */}
                        <td style={{ padding: '0.75rem 0.85rem', color: '#475569' }}>
                          <div style={{ fontWeight: 700, color: '#1e293b' }}>{b.fecha_creacion}</div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                            Por: <span style={{ fontWeight: 600 }}>{b.creado_por_nombre}</span>
                          </div>
                        </td>

                        {/* Acciones */}
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                            {/* Ver detalles */}
                            <button
                              type="button"
                              onClick={() => setModalDetalles({ abierto: true, backup: b })}
                              style={{
                                padding: '0.35rem 0.5rem',
                                borderRadius: '6px',
                                border: '1px solid #cbd5e1',
                                background: '#ffffff',
                                color: '#334155',
                                cursor: 'pointer',
                              }}
                              title="Ver detalles forenses del volcado"
                            >
                              <Eye size={13} />
                            </button>

                            {/* Descargar */}
                            <button
                              type="button"
                              onClick={() => descargarBackup(b.id_backup, b.nombre_archivo)}
                              style={{
                                padding: '0.35rem 0.5rem',
                                borderRadius: '6px',
                                border: '1px solid #0284c7',
                                background: '#f0f9ff',
                                color: '#0284c7',
                                cursor: 'pointer',
                              }}
                              title="Descargar archivo .sql a su equipo"
                            >
                              <Download size={13} />
                            </button>

                            {/* Restaurar */}
                            <button
                              type="button"
                              onClick={() => {
                                setConfirmacionTexto('');
                                setModalRestaurar({ abierto: true, backup: b });
                              }}
                              style={{
                                padding: '0.35rem 0.5rem',
                                borderRadius: '6px',
                                border: '1px solid #f59e0b',
                                background: '#fffbeb',
                                color: '#d97706',
                                cursor: 'pointer',
                              }}
                              title="Restaurar base de datos desde esta copia"
                            >
                              <RotateCcw size={13} />
                            </button>

                            {/* Eliminar */}
                            <button
                              type="button"
                              onClick={() => eliminarBackup(b.id_backup)}
                              style={{
                                padding: '0.35rem 0.5rem',
                                borderRadius: '6px',
                                border: '1px solid #fca5a5',
                                background: '#fef2f2',
                                color: '#dc2626',
                                cursor: 'pointer',
                              }}
                              title="Eliminar archivo del servidor"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* -------------------------------------------------------------------------
          PESTAÑA 2: PROGRAMACIÓN AUTOMÁTICA (CRON / SCHEDULER)
      ------------------------------------------------------------------------- */}
      {pestañaActiva === 'PROGRAMACION' && (
        <form onSubmit={handleSubmitConfig}>
          {/* PANEL PRINCIPAL DE PROGRAMACIÓN */}
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '1.5rem',
            marginBottom: '1.25rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          }}>
            {/* TOGGLE PRINCIPAL: HABILITADO / DESHABILITADO */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem 1.25rem',
              background: formConfig.habilitado ? '#f0fdf4' : '#f8fafc',
              border: formConfig.habilitado ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
              borderRadius: '10px',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  background: formConfig.habilitado ? '#22c55e' : '#94a3b8',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Timer size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>
                    Planificador Automático de Copias de Seguridad
                  </h3>
                  <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                    {formConfig.habilitado
                      ? 'El sistema ejecutará automáticamente volcados en segundo plano sin interrupción del servicio.'
                      : 'La programación automática se encuentra suspendida. Active el interruptor para reanudar el cron.'}
                  </p>
                </div>
              </div>

              {/* Botón Switch Toggle Elegante e Inmediato */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: formConfig.habilitado ? '#166534' : '#64748b' }}>
                  {formConfig.habilitado ? 'PROGRAMACIÓN HABILITADA' : 'PROGRAMACIÓN SUSPENDIDA'}
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={formConfig.habilitado}
                  disabled={guardandoConfig}
                  onClick={() => toggleHabilitadoDirecto(!formConfig.habilitado)}
                  title={formConfig.habilitado ? 'Clic para suspender la programación automática' : 'Clic para activar la programación automática'}
                  style={{
                    position: 'relative',
                    width: '50px',
                    height: '28px',
                    borderRadius: '9999px',
                    background: formConfig.habilitado ? '#059669' : '#cbd5e1',
                    border: 'none',
                    cursor: guardandoConfig ? 'not-allowed' : 'pointer',
                    transition: 'background 0.25s ease',
                    padding: '2px 3px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.15)',
                  }}
                >
                  <div style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
                    transform: formConfig.habilitado ? 'translateX(22px)' : 'translateX(0)',
                    transition: 'transform 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
                  }} />
                </button>
              </div>
            </div>

            {/* CAMPOS DE CONFIGURACIÓN */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {/* CAMPO 1: FRECUENCIA / PERIODICIDAD */}
              <div style={{
                background: '#f8fafc',
                padding: '1.1rem',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
              }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem' }}>
                  1. Frecuencia del Respaldo
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {Object.values(FRECUENCIAS_PROGRAMACION).map((f) => (
                    <label
                      key={f.id}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.6rem',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '8px',
                        border: formConfig.frecuencia === f.id ? '2px solid #0284c7' : '1px solid #cbd5e1',
                        background: formConfig.frecuencia === f.id ? '#f0f9ff' : '#ffffff',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="radio"
                        name="frecuencia"
                        value={f.id}
                        checked={formConfig.frecuencia === f.id}
                        onChange={() => setFormConfig({ ...formConfig, frecuencia: f.id })}
                        style={{ marginTop: '2px', accentColor: '#0284c7' }}
                      />
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>{f.label}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{f.descripcion}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* CAMPO 2: DÍA ESPECÍFICO (CONDICIONAL SEGÚN FRECUENCIA) */}
              <div style={{
                background: '#f8fafc',
                padding: '1.1rem',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
              }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem' }}>
                  2. Día de Ejecución Programado
                </label>

                {formConfig.frecuencia === 'DIARIO' && (
                  <div style={{ padding: '1rem', background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#475569', fontSize: '0.78rem' }}>
                    <div style={{ fontWeight: 700, color: '#0284c7', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={14} />
                      <span>Ciclo Diario Continuo</span>
                    </div>
                    El respaldo automático se ejecutará <strong>todos los días</strong> (Lunes a Domingo) puntualmente a la hora fijada.
                  </div>
                )}

                {formConfig.frecuencia === 'SEMANAL' && (
                  <div>
                    <span style={{ fontSize: '0.74rem', color: '#64748b', display: 'block', marginBottom: '0.5rem' }}>
                      Seleccione el día de la semana para generar la copia:
                    </span>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.4rem' }}>
                      {DIAS_SEMANA.map((dia) => (
                        <button
                          key={dia.id}
                          type="button"
                          onClick={() => setFormConfig({ ...formConfig, dia_semana: dia.id })}
                          style={{
                            padding: '0.45rem',
                            borderRadius: '6px',
                            border: formConfig.dia_semana === dia.id ? '2px solid #0284c7' : '1px solid #cbd5e1',
                            background: formConfig.dia_semana === dia.id ? '#0284c7' : '#ffffff',
                            color: formConfig.dia_semana === dia.id ? '#ffffff' : '#334155',
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          {dia.nombre}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {formConfig.frecuencia === 'MENSUAL' && (
                  <div>
                    <span style={{ fontSize: '0.74rem', color: '#64748b', display: 'block', marginBottom: '0.5rem' }}>
                      Día del mes calendario (1 al 31):
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}>
                      <input
                        type="number"
                        min="1"
                        max="31"
                        value={formConfig.dia_mes}
                        onChange={(e) => setFormConfig({ ...formConfig, dia_mes: parseInt(e.target.value) || 1 })}
                        style={{
                          width: '80px',
                          padding: '0.45rem 0.65rem',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.88rem',
                          fontWeight: 800,
                          textAlign: 'center',
                        }}
                      />
                      <span style={{ fontSize: '0.76rem', color: '#475569', fontWeight: 600 }}>
                        de cada mes
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      {[1, 15, 28].map((diaFast) => (
                        <button
                          key={diaFast}
                          type="button"
                          onClick={() => setFormConfig({ ...formConfig, dia_mes: diaFast })}
                          style={{
                            padding: '0.28rem 0.6rem',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            background: '#ffffff',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          Día {diaFast}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* CAMPO 3: HORA DE EJECUCIÓN (ZONA BOLIVIA) */}
              <div style={{
                background: '#f8fafc',
                padding: '1.1rem',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
              }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem' }}>
                  3. Hora Programada de Ejecución
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                  <input
                    type="time"
                    value={formConfig.hora_ejecucion}
                    onChange={(e) => setFormConfig({ ...formConfig, hora_ejecucion: e.target.value })}
                    required
                    style={{
                      padding: '0.5rem 0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #0284c7',
                      fontSize: '1rem',
                      fontWeight: 800,
                      color: '#0f172a',
                      background: '#ffffff',
                    }}
                  />
                  <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                    <div style={{ fontWeight: 700, color: '#0369a1' }}>Hora Boliviana (BOT)</div>
                    <div>America/La_Paz (UTC-4)</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', background: '#ffffff', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  💡 <strong>Recomendación Senior:</strong> Fijar el horario entre <strong>01:00 AM y 04:00 AM</strong> para minimizar impacto en el tráfico del consultorio.
                </div>
              </div>

              {/* CAMPO 4: TIPO DE RESPALDO AUTOMÁTICO */}
              <div style={{
                background: '#f8fafc',
                padding: '1.1rem',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
              }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem' }}>
                  4. Tipo de Respaldo Automático
                </label>
                <select
                  value={formConfig.tipo_backup}
                  onChange={(e) => setFormConfig({ ...formConfig, tipo_backup: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#0f172a',
                  }}
                >
                  <option value={TIPOS_BACKUP.COMPLETO}>COMPLETO (Estructura DDL + Todos los Datos)</option>
                  <option value={TIPOS_BACKUP.SOLO_DATOS}>SOLO DATOS (Sentencias INSERT clínicas)</option>
                  <option value={TIPOS_BACKUP.SOLO_ESTRUCTURA}>SOLO ESTRUCTURA (Esquema y Tablas DDL)</option>
                </select>
                <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginTop: '6px' }}>
                  Se generará con el tipo seleccionado cada vez que el cron se dispare.
                </span>
              </div>

              {/* CAMPO 5: POLÍTICA DE RETENCIÓN Y ROTACIÓN EN DISCO */}
              <div style={{
                background: '#f8fafc',
                padding: '1.1rem',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
              }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem' }}>
                  5. Retención y Rotación Automática
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '2px' }}>
                      Días de Retención:
                    </span>
                    <select
                      value={formConfig.retencion_dias}
                      onChange={(e) => setFormConfig({ ...formConfig, retencion_dias: parseInt(e.target.value) || 0 })}
                      style={{
                        width: '100%',
                        padding: '0.45rem',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                      }}
                    >
                      <option value={7}>7 días</option>
                      <option value={15}>15 días</option>
                      <option value={30}>30 días (Estándar)</option>
                      <option value={60}>60 días</option>
                      <option value={90}>90 días</option>
                      <option value={0}>Ilimitado (Sin purga)</option>
                    </select>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '2px' }}>
                      Máx Archivos en Disco:
                    </span>
                    <select
                      value={formConfig.limite_archivos}
                      onChange={(e) => setFormConfig({ ...formConfig, limite_archivos: parseInt(e.target.value) || 10 })}
                      style={{
                        width: '100%',
                        padding: '0.45rem',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                      }}
                    >
                      <option value={5}>5 respaldos</option>
                      <option value={10}>10 respaldos (Recomendado)</option>
                      <option value={20}>20 respaldos</option>
                      <option value={50}>50 respaldos</option>
                    </select>
                  </div>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', marginTop: '6px' }}>
                  El sistema elimina automáticamente los archivos más antiguos al superar los límites fijados.
                </span>
              </div>

              {/* CAMPO 6: CORREO DE ALERTA ADMINISTRATIVA */}
              <div style={{
                background: '#f8fafc',
                padding: '1.1rem',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
              }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem' }}>
                  6. Correo Electrónico de Alerta
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={16} color="#64748b" />
                  <input
                    type="email"
                    value={formConfig.email_notificacion}
                    onChange={(e) => setFormConfig({ ...formConfig, email_notificacion: e.target.value })}
                    placeholder="admin@clinicavidasalud.com"
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                    }}
                  />
                </div>
                <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', marginTop: '6px' }}>
                  Notificación al administrador ante cualquier eventualidad o finalización del cron.
                </span>
              </div>
            </div>

            {/* RESUMEN EJECUTIVO DEL PLAN CONFIGURADO */}
            <div style={{
              marginTop: '1.5rem',
              padding: '1rem 1.25rem',
              borderRadius: '10px',
              background: '#e0f2fe',
              border: '1px solid #bae6fd',
              color: '#0369a1',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
            }}>
              <Info size={20} color="#0284c7" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.86rem', marginBottom: '2px' }}>
                  Resumen de la Programación Configurada:
                </div>
                <div>
                  {formConfig.habilitado ? (
                    <span>
                      El sistema realizará automáticamente un respaldo de tipo <strong>{formConfig.tipo_backup}</strong>{' '}
                      {formConfig.frecuencia === 'DIARIO' && 'todos los días'}
                      {formConfig.frecuencia === 'SEMANAL' && `todos los días ${DIAS_SEMANA.find((d) => d.id === formConfig.dia_semana)?.nombre || 'Lunes'}`}
                      {formConfig.frecuencia === 'MENSUAL' && `el día ${formConfig.dia_mes} de cada mes`}{' '}
                      a las <strong>{formConfig.hora_ejecucion} (Hora de Bolivia)</strong>, conservando hasta{' '}
                      <strong>{formConfig.retencion_dias} días</strong> y un máximo de{' '}
                      <strong>{formConfig.limite_archivos} archivos</strong> en el servidor.
                    </span>
                  ) : (
                    <span>La ejecución automática se encuentra pausada. Los respaldos solo se generarán de forma manual.</span>
                  )}
                </div>
              </div>
            </div>

            {/* BOTONES DE GUARDADO Y SIMULACIÓN DE CRON */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '0.8rem',
              marginTop: '1.5rem',
              paddingTop: '1rem',
              borderTop: '1px solid #e2e8f0',
              flexWrap: 'wrap',
            }}>
              <button
                type="button"
                onClick={ejecutarJobProgramado}
                disabled={ejecutandoProgramado || guardandoConfig}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.55rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: '#f8fafc',
                  color: '#334155',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: ejecutandoProgramado ? 'not-allowed' : 'pointer',
                }}
                title="Ejecutar la tarea del Scheduler inmediatamente para probar el cron"
              >
                <Play size={14} color="#059669" />
                <span>{ejecutandoProgramado ? 'Disparando Scheduler...' : 'Probar / Ejecutar Tarea Ahora (Simular Cron)'}</span>
              </button>

              <button
                type="submit"
                disabled={guardandoConfig}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.55rem 1.25rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: guardandoConfig ? '#94a3b8' : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  cursor: guardandoConfig ? 'not-allowed' : 'pointer',
                  boxShadow: '0 2px 6px rgba(5, 150, 105, 0.3)',
                }}
              >
                <Save size={15} />
                <span>{guardandoConfig ? 'Guardando...' : 'Guardar Programación'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* =========================================================================
          MODAL 1: RESTAURACIÓN SEGURA DE BASE DE DATOS (DOBLE FACTOR)
      ========================================================================= */}
      {modalRestaurar.abierto && modalRestaurar.backup && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem',
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #cbd5e1',
            maxWidth: '560px',
            width: '100%',
            padding: '1.5rem',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: '#fef2f2',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#991b1b' }}>
                  Confirmar Restauración de Base de Datos
                </h3>
                <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                  Operación crítica de alta jerarquía de seguridad
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.82rem', color: '#334155', lineHeight: 1.5, margin: '0 0 1rem' }}>
              Está a punto de restaurar la base de datos a partir del volcado:{' '}
              <strong style={{ fontFamily: 'monospace', color: '#0f172a' }}>{modalRestaurar.backup.nombre_archivo}</strong>.
            </p>

            <div style={{
              background: '#fffbeb',
              border: '1px solid #fef08a',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              marginBottom: '1rem',
              fontSize: '0.76rem',
              color: '#92400e',
            }}>
              ⚠️ <strong>Advertencia:</strong> La restauración verificará el Checksum SHA-256 para asegurar que el archivo no fue alterado. Esta acción quedará auditada con su usuario en la bitácora institucional.
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
                Para confirmar, escriba la palabra <span style={{ color: '#dc2626', fontWeight: 800 }}>RESTAURAR</span>:
              </label>
              <input
                type="text"
                value={confirmacionTexto}
                onChange={(e) => setConfirmacionTexto(e.target.value)}
                placeholder="RESTAURAR"
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  fontFamily: 'monospace',
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.6rem' }}>
              <button
                type="button"
                onClick={() => setModalRestaurar({ abierto: false, backup: null })}
                style={{
                  padding: '0.5rem 0.9rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: '#f8fafc',
                  color: '#475569',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={confirmacionTexto !== 'RESTAURAR' || restaurando}
                onClick={() => ejecutarRestauracion(modalRestaurar.backup.id_backup)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 1.1rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: (confirmacionTexto !== 'RESTAURAR' || restaurando) ? '#94a3b8' : '#dc2626',
                  color: '#ffffff',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: (confirmacionTexto !== 'RESTAURAR' || restaurando) ? 'not-allowed' : 'pointer',
                }}
              >
                <RotateCcw size={14} className={restaurando ? 'animate-spin' : ''} />
                <span>{restaurando ? 'Restaurando...' : 'Confirmar y Restaurar'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: DETALLES FORENSES DEL VOLCADO
      ========================================================================= */}
      {modalDetalles.abierto && modalDetalles.backup && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem',
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #cbd5e1',
            maxWidth: '680px',
            width: '100%',
            padding: '1.5rem',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
            maxHeight: '88vh',
            overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: '#e0f2fe',
                  color: '#0284c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                    Metadatos Forenses del Respaldo
                  </h3>
                  <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                    Inspección técnica de integridad y tablas incluidas
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalDetalles({ abierto: false, backup: null })}
                style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '1.2rem', cursor: 'pointer', fontWeight: 800 }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1rem', fontSize: '0.78rem' }}>
              <div style={{ background: '#f8fafc', padding: '0.7rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ color: '#64748b', fontWeight: 600 }}>Archivo:</span>
                <div style={{ fontWeight: 800, color: '#0f172a', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                  {modalDetalles.backup.nombre_archivo}
                </div>
              </div>
              <div style={{ background: '#f8fafc', padding: '0.7rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ color: '#64748b', fontWeight: 600 }}>Tipo y Disparo:</span>
                <div style={{ fontWeight: 800, color: '#0f172a' }}>
                  {modalDetalles.backup.tipo_backup} • {modalDetalles.backup.tipo_disparo || 'MANUAL'}
                </div>
              </div>
              <div style={{ background: '#f8fafc', padding: '0.7rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ color: '#64748b', fontWeight: 600 }}>Tamaño:</span>
                <div style={{ fontWeight: 800, color: '#0f172a' }}>
                  {modalDetalles.backup.tamano_formateado} ({modalDetalles.backup.tamano_bytes?.toLocaleString()} bytes)
                </div>
              </div>
              <div style={{ background: '#f8fafc', padding: '0.7rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ color: '#64748b', fontWeight: 600 }}>Fecha Generación:</span>
                <div style={{ fontWeight: 800, color: '#0f172a' }}>
                  {modalDetalles.backup.fecha_creacion}
                </div>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
              <span style={{ color: '#64748b', fontWeight: 700, fontSize: '0.74rem' }}>Firma Criptográfica SHA-256:</span>
              <div style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#0284c7', wordBreak: 'break-all', marginTop: '2px', fontWeight: 700 }}>
                {modalDetalles.backup.checksum_sha256 || 'Sin hash registrado'}
              </div>
            </div>

            {/* Conteo de registros por tabla */}
            {modalDetalles.backup.detalles?.resumen_por_tabla && (
              <div>
                <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem' }}>
                  Tablas y Registros Respaldados ({modalDetalles.backup.detalles.tablas_respaldadas || 0} tablas)
                </h4>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: '0.4rem',
                  maxHeight: '180px',
                  overflowY: 'auto',
                  border: '1px solid #e2e8f0',
                  padding: '0.5rem',
                  borderRadius: '8px',
                  background: '#f8fafc',
                }}>
                  {Object.entries(modalDetalles.backup.detalles.resumen_por_tabla).map(([tbl, cnt]) => (
                    <div key={tbl} style={{ background: '#ffffff', padding: '4px 8px', borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '0.7rem' }}>
                      <span style={{ color: '#475569', fontWeight: 600 }}>{tbl}:</span>{' '}
                      <strong style={{ color: '#0284c7' }}>{cnt}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
              <button
                type="button"
                onClick={() => setModalDetalles({ abierto: false, backup: null })}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: '#0284c7',
                  color: '#ffffff',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CU22_BackupView;
