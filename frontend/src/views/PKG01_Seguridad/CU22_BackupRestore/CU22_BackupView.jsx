import React, { useState } from 'react';
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
} from 'lucide-react';
import useCU22BackupRestoreController from '../../../controllers/PKG01_Seguridad/CU22_BackupRestore/CU22_BackupRestoreController';

export const CU22_BackupView = () => {
  const {
    backups,
    kpis,
    estadoSistema,
    loading,
    generando,
    restaurando,
    error,
    mensajeExito,
    limpiarMensajes,
    tipoFiltro,
    setTipoFiltro,
    modalRestaurar,
    setModalRestaurar,
    modalDetalles,
    setModalDetalles,
    recargar,
    generarBackup,
    descargarBackup,
    ejecutarRestauracion,
    eliminarBackup,
  } = useCU22BackupRestoreController();

  const [confirmacionTexto, setConfirmacionTexto] = useState('');

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
              Generación automatizada de volcados SQL, verificación de integridad con checksum SHA-256 y restauración auditable.
            </p>
          </div>
        </div>

        {/* BOTONES DE DISPARO RÁPIDO DE BACKUP */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={recargar}
            disabled={loading}
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
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            title="Actualizar lista de backups"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refrescar</span>
          </button>

          <button
            type="button"
            onClick={() => generarBackup('SOLO_ESTRUCTURA')}
            disabled={generando || loading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#0284c7',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: generando ? 'not-allowed' : 'pointer',
            }}
          >
            <Layers size={14} />
            <span>Solo Estructura</span>
          </button>

          <button
            type="button"
            onClick={() => generarBackup('SOLO_DATOS')}
            disabled={generando || loading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#4f46e5',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: generando ? 'not-allowed' : 'pointer',
            }}
          >
            <FileCode size={14} />
            <span>Solo Datos</span>
          </button>

          <button
            type="button"
            onClick={() => generarBackup('COMPLETO')}
            disabled={generando || loading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.45rem 0.95rem',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              color: '#ffffff',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: generando ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 6px rgba(5, 150, 105, 0.25)',
            }}
          >
            <HardDrive size={15} />
            <span>{generando ? 'Volcando BD...' : 'Generar Backup Completo'}</span>
          </button>
        </div>
      </div>

      {/* MENSAJES DE ESTADO */}
      {mensajeExito && (
        <div style={{
          padding: '0.85rem 1.15rem',
          borderRadius: '10px',
          background: '#ecfdf5',
          border: '1px solid #a7f3d0',
          color: '#065f46',
          fontSize: '0.78rem',
          fontWeight: 600,
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={16} color="#059669" />
            <span>{mensajeExito}</span>
          </div>
          <button onClick={limpiarMensajes} style={{ border: 'none', background: 'transparent', color: '#065f46', cursor: 'pointer', fontWeight: 800 }}>
            ✕
          </button>
        </div>
      )}

      {error && (
        <div style={{
          padding: '0.85rem 1.15rem',
          borderRadius: '10px',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#b91c1c',
          fontSize: '0.78rem',
          fontWeight: 600,
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <XCircle size={16} color="#dc2626" />
            <span>{error}</span>
          </div>
          <button onClick={limpiarMensajes} style={{ border: 'none', background: 'transparent', color: '#b91c1c', cursor: 'pointer', fontWeight: 800 }}>
            ✕
          </button>
        </div>
      )}

      {/* =========================================================================
          2. BANNER DE SALUD TÉCNICA DEL MOTOR DE BASE DE DATOS
      ========================================================================= */}
      {estadoSistema && (
        <div style={{
          background: '#0f172a',
          color: '#ffffff',
          padding: '1rem 1.25rem',
          borderRadius: '12px',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: '#1e293b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8',
            }}>
              <Server size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>
                  Motor: {estadoSistema.motor} ({estadoSistema.base_datos})
                </span>
                <span style={{
                  padding: '1px 6px',
                  borderRadius: '9999px',
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  background: '#059669',
                  color: '#ffffff',
                }}>
                  Conexión Activa
                </span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>
                {estadoSistema.version} • Host: {estadoSistema.host}:{estadoSistema.puerto} • {estadoSistema.total_tablas} tablas públicas
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.74rem' }}>
            <div>
              <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.68rem' }}>Hora del Servidor:</span>
              <strong style={{ color: '#f8fafc' }}>{estadoSistema.fecha_hora_serv}</strong>
            </div>
            <div>
              <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.68rem' }}>Seguridad:</span>
              <strong style={{ color: '#38bdf8' }}>Cifrado SSL / SHA-256</strong>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          3. TARJETAS DE INDICADORES (KPIS)
      ========================================================================= */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '0.85rem',
        marginBottom: '1.25rem',
      }}>
        <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Total Backups</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: '0.35rem 0 0.15rem' }}>
            {kpis?.total_backups || 0}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Archivos disponibles</div>
        </div>

        <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase' }}>Espacio en Disco</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0284c7', margin: '0.35rem 0 0.15rem' }}>
            {kpis?.espacio_ocupado || '0 KB'}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#0284c7' }}>Almacenamiento ocupado</div>
        </div>

        <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase' }}>Último Respaldo</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#059669', margin: '0.65rem 0 0.15rem' }}>
            {kpis?.ultimo_backup || 'Sin fecha'}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Fecha de generación</div>
        </div>

        <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#4f46e5', textTransform: 'uppercase' }}>Última Restauración</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#4f46e5', margin: '0.65rem 0 0.15rem' }}>
            {kpis?.ultimo_restaurado || 'Ninguna'}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Operación ejecutada</div>
        </div>

        <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase' }}>Estado de Salud</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#059669', margin: '0.5rem 0 0.15rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={20} />
            <span>{kpis?.estado_salud || 'ÓPTIMO'}</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Política de continuidad</div>
        </div>
      </div>

      {/* =========================================================================
          4. TABLA DE HISTORIAL DE BACKUPS
      ========================================================================= */}
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      }}>
        <div style={{
          padding: '0.85rem 1.25rem',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <HardDrive size={16} color="#0284c7" />
            <span>Registro de Volcados de Seguridad y Restauración</span>
          </div>

          {/* FILTRO POR TIPO */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem' }}>
            <span style={{ color: '#64748b', fontWeight: 600 }}>Filtrar por tipo:</span>
            <select
              value={tipoFiltro}
              onChange={(e) => setTipoFiltro(e.target.value)}
              style={{
                padding: '0.3rem 0.6rem',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#1e293b',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="TODOS">Todos los Tipos</option>
              <option value="COMPLETO">Completo</option>
              <option value="SOLO_DATOS">Solo Datos</option>
              <option value="SOLO_ESTRUCTURA">Solo Estructura</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.76rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.68rem' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Archivo de Backup</th>
                <th style={{ padding: '0.75rem 1rem' }}>Tipo</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Tamaño</th>
                <th style={{ padding: '0.75rem 1rem' }}>SHA-256 Checksum</th>
                <th style={{ padding: '0.75rem 1rem' }}>Creado Por</th>
                <th style={{ padding: '0.75rem 1rem' }}>Fecha Generación</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Estado</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {backups.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '2.5rem', textAlign: 'center', color: '#94a3b8', fontStyle: 'italic' }}>
                    No hay copias de seguridad registradas en este momento. Utilice el botón superior para crear una.
                  </td>
                </tr>
              ) : (
                backups.map((b) => (
                  <tr key={b.id_backup} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ fontWeight: 700, color: '#0f172a', fontFamily: 'monospace' }}>
                        {b.nombre_archivo}
                      </div>
                      {b.detalles?.total_registros !== undefined && (
                        <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                          {b.detalles.tablas_respaldadas} tablas • {b.detalles.total_registros} registros volcados
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        background: b.tipo_backup === 'COMPLETO' ? '#f0f9ff' : b.tipo_backup === 'SOLO_DATOS' ? '#eef2ff' : '#f8fafc',
                        color: b.tipo_backup === 'COMPLETO' ? '#0369a1' : b.tipo_backup === 'SOLO_DATOS' ? '#4338ca' : '#475569',
                        border: '1px solid #cbd5e1',
                      }}>
                        {b.tipo_backup}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'center', fontWeight: 700, color: '#0f172a' }}>
                      {b.tamano_formateado}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{
                        fontFamily: 'monospace',
                        fontSize: '0.68rem',
                        background: '#f1f5f9',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        color: '#475569',
                        display: 'inline-block',
                        maxWidth: '140px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }} title={b.checksum_sha256}>
                        {b.checksum_sha256 || 'N/A'}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: '#475569', fontWeight: 600 }}>
                      {b.creado_por_nombre}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>
                      {b.fecha_creacion}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        background: b.estado === 'RESTAURADO' ? '#e0e7ff' : b.estado === 'COMPLETADO' ? '#ecfdf5' : '#fee2e2',
                        color: b.estado === 'RESTAURADO' ? '#3730a3' : b.estado === 'COMPLETADO' ? '#059669' : '#b91c1c',
                        border: b.estado === 'RESTAURADO' ? '1px solid #c7d2fe' : b.estado === 'COMPLETADO' ? '1px solid #a7f3d0' : '1px solid #fecaca',
                      }}>
                        {b.estado}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.35rem' }}>
                        {/* Descargar */}
                        <button
                          type="button"
                          onClick={() => descargarBackup(b.id_backup, b.nombre_archivo)}
                          style={{
                            padding: '0.3rem 0.5rem',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            background: '#f8fafc',
                            color: '#0284c7',
                            cursor: 'pointer',
                          }}
                          title="Descargar volcado .SQL"
                        >
                          <Download size={14} />
                        </button>

                        {/* Ver Detalles */}
                        <button
                          type="button"
                          onClick={() => setModalDetalles({ abierto: true, backup: b })}
                          style={{
                            padding: '0.3rem 0.5rem',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            background: '#f8fafc',
                            color: '#475569',
                            cursor: 'pointer',
                          }}
                          title="Ver resumen y metadatos de tablas"
                        >
                          <Eye size={14} />
                        </button>

                        {/* Restaurar */}
                        <button
                          type="button"
                          onClick={() => {
                            setConfirmacionTexto('');
                            setModalRestaurar({ abierto: true, backup: b });
                          }}
                          style={{
                            padding: '0.3rem 0.55rem',
                            borderRadius: '6px',
                            border: '1px solid #f59e0b',
                            background: '#fffbeb',
                            color: '#b45309',
                            cursor: 'pointer',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px',
                          }}
                          title="Restaurar base de datos a este punto"
                        >
                          <RotateCcw size={13} />
                          <span>Restaurar</span>
                        </button>

                        {/* Eliminar */}
                        <button
                          type="button"
                          onClick={() => eliminarBackup(b.id_backup)}
                          style={{
                            padding: '0.3rem 0.5rem',
                            borderRadius: '6px',
                            border: '1px solid #fecaca',
                            background: '#fef2f2',
                            color: '#dc2626',
                            cursor: 'pointer',
                          }}
                          title="Eliminar backup permanentemente"
                        >
                          <Trash2 size={14} />
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

      {/* =========================================================================
          5. MODAL DE CONFIRMACIÓN CRÍTICA DE RESTAURACIÓN
      ========================================================================= */}
      {modalRestaurar.abierto && modalRestaurar.backup && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
        }}>
          <div style={{
            background: '#ffffff',
            maxWidth: '560px',
            width: '100%',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden',
          }}>
            <div style={{ background: '#b91c1c', padding: '1rem 1.25rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={20} />
              <strong style={{ fontSize: '0.9rem' }}>Confirmación Crítica de Restauración</strong>
            </div>

            <div style={{ padding: '1.25rem', fontSize: '0.8rem', color: '#334155', lineHeight: 1.5 }}>
              <p style={{ margin: '0 0 0.85rem' }}>
                Está a punto de ejecutar una operación de <strong>Restauración de Base de Datos</strong> utilizando la copia:
              </p>

              <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontFamily: 'monospace', fontSize: '0.75rem', marginBottom: '1rem' }}>
                <div><strong>Archivo:</strong> {modalRestaurar.backup.nombre_archivo}</div>
                <div><strong>Tipo:</strong> {modalRestaurar.backup.tipo_backup}</div>
                <div><strong>Tamaño:</strong> {modalRestaurar.backup.tamano_formateado}</div>
                <div><strong>SHA-256:</strong> {modalRestaurar.backup.checksum_sha256}</div>
              </div>

              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', color: '#92400e', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.75rem' }}>
                ⚠️ <strong>Aviso de Auditoría Médica:</strong> La restauración verificará la integridad criptográfica y actualizará los registros de tablas clínicas. Esta operación quedará auditada formalmente.
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                  Escriba <span style={{ color: '#b91c1c' }}>RESTAURAR</span> para confirmar:
                </label>
                <input
                  type="text"
                  value={confirmacionTexto}
                  onChange={(e) => setConfirmacionTexto(e.target.value.toUpperCase())}
                  placeholder="RESTAURAR"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '7px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.8rem',
                    boxSizing: 'border-box',
                    outline: 'none',
                    fontWeight: 700,
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setModalRestaurar({ abierto: false, backup: null })}
                  style={{
                    padding: '0.45rem 0.85rem',
                    borderRadius: '7px',
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    color: '#475569',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={() => ejecutarRestauracion(modalRestaurar.backup.id_backup)}
                  disabled={confirmacionTexto !== 'RESTAURAR' || restaurando}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: '7px',
                    border: 'none',
                    background: confirmacionTexto === 'RESTAURAR' ? '#b91c1c' : '#cbd5e1',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: confirmacionTexto === 'RESTAURAR' && !restaurando ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {restaurando ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Verificando y Restaurando...</span>
                    </>
                  ) : (
                    <span>Confirmar Restauración</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          6. MODAL DE DETALLES Y TABLAS DEL BACKUP
      ========================================================================= */}
      {modalDetalles.abierto && modalDetalles.backup && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
        }}>
          <div style={{
            background: '#ffffff',
            maxWidth: '650px',
            width: '100%',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden',
          }}>
            <div style={{ background: '#0f172a', padding: '1rem 1.25rem', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Eye size={18} color="#38bdf8" />
                <strong style={{ fontSize: '0.85rem' }}>Metadatos y Desglose de Tablas</strong>
              </div>
              <button
                type="button"
                onClick={() => setModalDetalles({ abierto: false, backup: null })}
                style={{ border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: '1rem', fontWeight: 800 }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '1.25rem', fontSize: '0.78rem', color: '#334155' }}>
              <div style={{ marginBottom: '1rem' }}>
                <strong>Archivo:</strong> <span style={{ fontFamily: 'monospace' }}>{modalDetalles.backup.nombre_archivo}</span>
              </div>

              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                Desglose de Registros por Tabla:
              </div>

              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '0.75rem',
                maxHeight: '280px',
                overflowY: 'auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.4rem',
              }}>
                {modalDetalles.backup.detalles?.resumen_por_tabla ? (
                  Object.entries(modalDetalles.backup.detalles.resumen_por_tabla).map(([tabla, count]) => (
                    <div key={tabla} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 8px', background: '#ffffff', borderRadius: '4px', border: '1px solid #f1f5f9' }}>
                      <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{tabla}</span>
                      <strong style={{ color: '#0284c7' }}>{count}</strong>
                    </div>
                  ))
                ) : (
                  <div style={{ color: '#94a3b8', fontStyle: 'italic', gridColumn: 'span 2' }}>
                    No hay desglose por tabla disponible para este volcado.
                  </div>
                )}
              </div>

              <div style={{ marginTop: '1.25rem', textAlign: 'right' }}>
                <button
                  type="button"
                  onClick={() => setModalDetalles({ abierto: false, backup: null })}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: '7px',
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    color: '#334155',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CU22_BackupView;
