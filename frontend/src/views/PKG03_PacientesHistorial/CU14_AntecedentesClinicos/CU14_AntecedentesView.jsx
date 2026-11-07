import React, { useState } from 'react';
import {
  FileText,
  AlertTriangle,
  Search,
  Droplet,
  HeartPulse,
  Activity,
  Edit,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  User,
  Shield,
  Phone,
  Calendar,
  Save,
  X,
  Stethoscope,
  Info,
  Eye,
  Printer,
  ShieldAlert,
  Clock,
  Mail,
  UserCheck,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { useCU14AntecedentesClinicosController } from '../../../controllers/PKG03_PacientesHistorial/CU14_AntecedentesClinicos/CU14_AntecedentesClinicosController';

export const CU14_AntecedentesView = () => {
  const {
    pacientes,
    kpis,
    loading,
    guardando,
    error,
    mensajeExito,
    searchTerm,
    setSearchTerm,
    filtroTipoSangre,
    setFiltroTipoSangre,
    pacienteSeleccionado,
    modalEdicionAbierto,
    formData,
    setFormData,
    abrirEdicion,
    cerrarEdicion,
    guardarAntecedentes,
    cargarPacientes,
    limpiarMensajes,
  } = useCU14AntecedentesClinicosController();

  // Estado para el Visor Explícito de Expediente Clínico
  const [pacienteVisor, setPacienteVisor] = useState(null);
  const [modalVisorAbierto, setModalVisorAbierto] = useState(false);

  const abrirVisor = (paciente) => {
    setPacienteVisor(paciente);
    setModalVisorAbierto(true);
  };

  const cerrarVisor = () => {
    setModalVisorAbierto(false);
    setPacienteVisor(null);
  };

  /**
   * Determina con rigor clínico si el paciente registra alergias verdaderas o ninguna
   */
  const tieneAlergiasReales = (texto) => {
    if (!texto) return false;
    const t = texto.trim().toLowerCase();
    const patronesNegativos = [
      'ninguna',
      'ninguno',
      'no',
      'n/a',
      'no registrado',
      'ninguna registrada',
      'ninguna conocida',
      'sin alergias',
      'sin alergia',
      'no refiere',
      'desconocido',
      'nkda',
      'niega',
    ];
    if (patronesNegativos.some((patron) => t === patron || t.startsWith(patron))) {
      return false;
    }
    return t.length > 2;
  };

  const formatearFechaLimpia = (fechaIso) => {
    if (!fechaIso) return 'N/D';
    const limpia = String(fechaIso).split('T')[0];
    const partes = limpia.split('-');
    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return limpia;
  };

  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return 'N/D';
    const limpia = String(fechaNacimiento).split('T')[0];
    const hoy = new Date();
    const nac = new Date(limpia);
    let edad = hoy.getFullYear() - nac.getFullYear();
    const m = hoy.getMonth() - nac.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) {
      edad--;
    }
    return isNaN(edad) ? 'N/D' : edad;
  };

  return (
    <div style={{ padding: '0.5rem 1rem 3rem', maxWidth: '1440px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* 1. CABECERA DEL CU14 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.25rem',
        background: '#ffffff',
        padding: '1rem 1.25rem',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #0f766e 0%, #115e59 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 10px rgba(15, 118, 110, 0.25)',
          }}>
            <FileText size={24} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{
                background: '#0f766e',
                color: '#ffffff',
                fontSize: '0.68rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '4px',
                fontFamily: 'monospace',
              }}>
                CU14
              </span>
              <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                Registrar y Actualizar Antecedentes Clínicos Base
              </h1>
            </div>
            <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#64748b' }}>
              Expedientes médicos institucionales, seguridad farmacológica, grupo sanguíneo y antecedentes patológicos.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={cargarPacientes}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.45rem 0.85rem',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            background: '#ffffff',
            color: '#475569',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <RefreshCw size={15} />
          Actualizar Lista
        </button>
      </div>

      {/* FEEDBACK Y ALERTAS */}
      {error && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '10px',
          padding: '0.75rem 1rem',
          color: '#b91c1c',
          marginBottom: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.85rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
          <button onClick={limpiarMensajes} style={{ background: 'none', border: 'none', color: '#b91c1c', cursor: 'pointer', fontWeight: 800 }}>✕</button>
        </div>
      )}

      {mensajeExito && (
        <div style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '10px',
          padding: '0.85rem 1.15rem',
          color: '#15803d',
          marginBottom: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.88rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <CheckCircle2 size={20} color="#16a34a" />
            <span style={{ fontWeight: 600 }}>{mensajeExito}</span>
          </div>
          <button onClick={limpiarMensajes} style={{ background: 'none', border: 'none', color: '#16a34a', cursor: 'pointer', fontWeight: 800 }}>✕</button>
        </div>
      )}

      {/* 2. KPIS / CONTADORES */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: '#f0fdfa', color: '#0f766e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Total Historias Clínicas</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>{kpis.total_expedientes}</div>
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: '#fef2f2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Droplet size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Con Grupo Sanguíneo</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#b91c1c' }}>{kpis.con_tipo_sangre}</div>
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: '#fff1f2', color: '#be123c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldAlert size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Alertas Farmacológicas Activas</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#be123c' }}>{kpis.con_alergias_alertas}</div>
          </div>
        </div>
      </div>

      {/* 3. FILTROS Y BÚSQUEDA */}
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        padding: '1rem',
        marginBottom: '1.25rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '260px' }}>
          <Search size={16} color="#64748b" />
          <input
            type="text"
            placeholder="Buscar por paciente, CI, expediente o alergia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.45rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.82rem',
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>Grupo Sanguíneo:</label>
          <select
            value={filtroTipoSangre}
            onChange={(e) => setFiltroTipoSangre(e.target.value)}
            style={{
              padding: '0.45rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.82rem',
              background: '#f8fafc',
            }}
          >
            <option value="">Todos los grupos</option>
            {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. LISTADO DE EXPEDIENTES CLÍNICOS BASE */}
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        padding: '1.25rem',
      }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b', fontSize: '0.85rem' }}>
            Cargando expedientes clínicos base...
          </div>
        ) : pacientes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b', fontSize: '0.85rem' }}>
            No se encontraron expedientes con los criterios seleccionados.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '0.65rem' }}>EXPEDIENTE</th>
                  <th style={{ padding: '0.65rem' }}>PACIENTE</th>
                  <th style={{ padding: '0.65rem' }}>GRUPO SANGUÍNEO</th>
                  <th style={{ padding: '0.65rem' }}>SEGURIDAD FARMACOLÓGICA</th>
                  <th style={{ padding: '0.65rem' }}>PATOLOGÍAS / CIRUGÍAS</th>
                  <th style={{ padding: '0.65rem', textAlign: 'right' }}>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {pacientes.map((p) => {
                  const tieneAlergias = tieneAlergiasReales(p.alergias_medicamentos);
                  return (
                    <tr key={p.id_paciente} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.65rem', fontFamily: 'monospace', fontWeight: 800, color: '#0f766e' }}>
                        {p.numero_expediente}
                      </td>
                      <td style={{ padding: '0.65rem' }}>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{p.nombre_completo}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>CI: {p.ci} | Tel: {p.telefono || 'S/N'}</div>
                      </td>
                      <td style={{ padding: '0.65rem' }}>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          background: p.tipo_sangre && p.tipo_sangre !== 'No registrado' ? '#fee2e2' : '#f1f5f9',
                          color: p.tipo_sangre && p.tipo_sangre !== 'No registrado' ? '#b91c1c' : '#64748b',
                          border: p.tipo_sangre && p.tipo_sangre !== 'No registrado' ? '1px solid #fca5a5' : '1px solid #cbd5e1',
                        }}>
                          {p.tipo_sangre || 'N/R'}
                        </span>
                      </td>
                      <td style={{ padding: '0.65rem' }}>
                        {tieneAlergias ? (
                          <div style={{
                            padding: '3px 8px',
                            borderRadius: '6px',
                            background: '#fff1f2',
                            border: '1px solid #fecdd3',
                            color: '#9f1239',
                            fontWeight: 700,
                            fontSize: '0.74rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            maxWidth: '280px',
                          }}>
                            <ShieldAlert size={13} color="#be123c" style={{ flexShrink: 0 }} />
                            <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                              Alerta RAM: {p.alergias_medicamentos}
                            </span>
                          </div>
                        ) : (
                          <div style={{
                            padding: '3px 8px',
                            borderRadius: '6px',
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            color: '#475569',
                            fontWeight: 600,
                            fontSize: '0.72rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                          }}>
                            <ShieldCheck size={13} color="#0f766e" style={{ flexShrink: 0 }} />
                            <span>NKDA (Sin alergias reportadas)</span>
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '0.65rem', fontSize: '0.74rem', color: '#475569', maxWidth: '240px' }}>
                        <div><strong>Patologías:</strong> {p.antecedentes_patologicos || 'Ninguno'}</div>
                        <div><strong>Quirúrgicos:</strong> {p.antecedentes_quirurgicos || 'Ninguno'}</div>
                      </td>
                      <td style={{ padding: '0.65rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          <button
                            type="button"
                            onClick={() => abrirVisor(p)}
                            style={{
                              padding: '0.4rem 0.75rem',
                              borderRadius: '6px',
                              border: '1px solid #0f766e',
                              background: '#f0fdfa',
                              color: '#0f766e',
                              fontWeight: 700,
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                            }}
                            title="Ver ficha clínica explícita"
                          >
                            <Eye size={13} />
                            Ver Expediente
                          </button>

                          <button
                            type="button"
                            onClick={() => abrirEdicion(p)}
                            style={{
                              padding: '0.4rem 0.75rem',
                              borderRadius: '6px',
                              border: '1px solid #cbd5e1',
                              background: '#ffffff',
                              color: '#334155',
                              fontWeight: 700,
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                            }}
                          >
                            <Edit size={13} />
                            Editar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 5. VISOR EXPLÍCITO Y FORMAL DE ANTECEDENTES CLÍNICOS */}
      {/* ======================================================== */}
      {modalVisorAbierto && pacienteVisor && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem',
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '840px',
            maxHeight: '92vh',
            overflowY: 'auto',
            padding: '2rem',
            boxShadow: '0 24px 48px rgba(0,0,0,0.3)',
            border: '1px solid #cbd5e1',
          }}>
            {/* MEMBRETE CLÍNICO FORMAL */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderBottom: '2px solid #0f766e',
              paddingBottom: '1rem',
              marginBottom: '1.25rem',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ background: '#0f766e', color: '#ffffff', fontSize: '0.68rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', letterSpacing: '0.04em' }}>
                    DOCUMENTO CLÍNICO OFICIAL
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                    Historia Clínica Ambulatoria — Clínica Vida Salud
                  </span>
                </div>
                <h2 style={{ margin: '0.25rem 0 0', fontSize: '1.35rem', fontWeight: 900, color: '#0f172a' }}>
                  Ficha de Antecedentes Clínicos y Seguridad del Paciente
                </h2>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                  Unidad de Archivo Clínico y Auditoría Médica Institucional
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '6px',
                  background: '#0f172a',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  fontWeight: 900,
                  fontFamily: 'monospace',
                }}>
                  {pacienteVisor.numero_expediente}
                </span>
                <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.35rem' }}>
                  Apertura: {formatearFechaLimpia(pacienteVisor.fecha_apertura)}
                </div>
              </div>
            </div>

            {/* SECCIÓN 1: IDENTIFICACIÓN Y CONTACTO DE EMERGENCIA */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.5fr 1fr',
              gap: '1rem',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1.15rem',
              marginBottom: '1.25rem',
            }}>
              <div>
                <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Ficha de Identificación del Paciente
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', margin: '0.2rem 0' }}>
                  {pacienteVisor.nombre_completo}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#334155', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.35rem' }}>
                  <span>CI: <strong>{pacienteVisor.ci}</strong></span>
                  <span>•</span>
                  <span>Fecha Nac.: <strong>{formatearFechaLimpia(pacienteVisor.fecha_nacimiento)}</strong></span>
                  <span>•</span>
                  <span>Edad Actual: <strong>{calcularEdad(pacienteVisor.fecha_nacimiento)} años</strong></span>
                  <span>•</span>
                  <span>Género: <strong>{pacienteVisor.genero || 'No especificado'}</strong></span>
                </div>
                <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '0.25rem' }}>
                  Contacto directo: Tel: <strong>{pacienteVisor.telefono || 'Sin teléfono'}</strong> | Email: {pacienteVisor.email || 'Sin correo'}
                </div>
              </div>

              {/* CONTACTO DE EMERGENCIA */}
              <div style={{ background: '#ffffff', borderRadius: '8px', padding: '0.85rem', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.68rem', color: '#475569', fontWeight: 800, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Phone size={13} color="#0f766e" />
                  Contacto en Caso de Emergencia
                </div>
                {pacienteVisor.contacto_emergencia ? (
                  <div style={{ marginTop: '0.35rem', fontSize: '0.8rem' }}>
                    <div style={{ fontWeight: 800, color: '#0f172a' }}>{pacienteVisor.contacto_emergencia.nombre}</div>
                    <div style={{ color: '#475569', fontSize: '0.74rem' }}>
                      Parentesco / Vínculo: <strong>{pacienteVisor.contacto_emergencia.parentesco}</strong>
                    </div>
                    <div style={{ color: '#0f766e', fontWeight: 800, fontSize: '0.8rem', marginTop: '0.2rem' }}>
                      Teléfono: {pacienteVisor.contacto_emergencia.telefono}
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.35rem' }}>
                    No se encuentra registrado contacto de emergencia.
                  </div>
                )}
              </div>
            </div>

            {/* SECCIÓN 2: PROTOCOLO DE SEGURIDAD FARMACOLÓGICA Y TRANSFUSIONAL */}
            <div style={{ display: 'grid', gridTemplateColumns: '170px 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              {/* GRUPO SANGUÍNEO */}
              <div style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '12px',
                padding: '1rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#991b1b', fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase' }}>
                  <Droplet size={14} color="#dc2626" />
                  Grupo y Factor Rh
                </div>
                <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#b91c1c', margin: '0.2rem 0', fontFamily: 'monospace' }}>
                  {pacienteVisor.tipo_sangre || 'N/R'}
                </div>
                <div style={{ fontSize: '0.65rem', color: '#64748b' }}>
                  Verificación de compatibilidad transfusional
                </div>
              </div>

              {/* PANEL DE SEGURIDAD FARMACOLÓGICA (ALERGIAS / REACCIONES ADVERSAS) */}
              {(() => {
                const tieneAlergias = tieneAlergiasReales(pacienteVisor.alergias_medicamentos);

                if (tieneAlergias) {
                  return (
                    <div style={{
                      background: '#fff1f2',
                      border: '1.5px solid #be123c',
                      borderRadius: '12px',
                      padding: '1rem 1.15rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                            <ShieldAlert size={18} color="#be123c" />
                            <span style={{ fontSize: '0.78rem', fontWeight: 900, color: '#9f1239', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                              Registro Clínico de Hipersensibilidad y Alergias (RAM)
                            </span>
                          </div>
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: '#9f1239',
                            color: '#ffffff',
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            letterSpacing: '0.05em',
                          }}>
                            ALERTA FARMACOLÓGICA ACTIVA
                          </span>
                        </div>

                        <div style={{
                          background: '#ffffff',
                          border: '1px solid #fecdd3',
                          borderRadius: '8px',
                          padding: '0.6rem 0.85rem',
                          marginTop: '0.4rem',
                        }}>
                          <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                            Fármacos y Sustancias con Reacción Adversa Documentada:
                          </div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#881337', marginTop: '0.15rem', fontFamily: 'monospace' }}>
                            {pacienteVisor.alergias_medicamentos}
                          </div>
                        </div>
                      </div>

                      <div style={{ fontSize: '0.7rem', color: '#9f1239', marginTop: '0.5rem', lineHeight: 1.4, borderTop: '1px dashed #fca5a5', paddingTop: '0.4rem' }}>
                        <strong>Restricción terapéutica estricta:</strong> Contraindicada la prescripción, dosificación o administración del principio activo indicado, así como fármacos de reactividad cruzada del mismo grupo terapéutico.
                      </div>
                    </div>
                  );
                }

                // CASO SIN ALERGIAS (NKDA - No Known Drug Allergies)
                return (
                  <div style={{
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRadius: '12px',
                    padding: '1rem 1.15rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <ShieldCheck size={18} color="#0f766e" />
                          <span style={{ fontSize: '0.78rem', fontWeight: 900, color: '#134e4a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Registro de Hipersensibilidad y Alergias a Medicamentos
                          </span>
                        </div>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: '#f0fdfa',
                          border: '1px solid #99f6e4',
                          color: '#0f766e',
                          fontSize: '0.65rem',
                          fontWeight: 800,
                        }}>
                          ESTADO: NKDA CONFIRMADO
                        </span>
                      </div>

                      <div style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '0.6rem 0.85rem',
                        marginTop: '0.4rem',
                      }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>
                          Sin antecedentes conocidos de hipersensibilidad o alergias farmacológicas.
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.15rem' }}>
                          Registro clínico: "{pacienteVisor.alergias_medicamentos || 'Ninguna conocida'}"
                        </div>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.5rem', lineHeight: 1.4, borderTop: '1px solid #e2e8f0', paddingTop: '0.4rem' }}>
                      <strong>Protocolo clínico:</strong> Reconfirmar verbalmente con el paciente antes de administrar o prescribir nuevos fármacos en consulta o procedimiento.
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* SECCIÓN 3: ANTECEDENTES PATOLÓGICOS Y ANAMNESIS FAMILIAR */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              {/* ANTECEDENTES FAMILIARES / HEREDITARIOS */}
              <div style={{ background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '1rem' }}>
                <div style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 800, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.45rem' }}>
                  <HeartPulse size={15} color="#475569" />
                  Antecedentes Heredofamiliares
                </div>
                <div style={{ fontSize: '0.82rem', color: '#0f172a', lineHeight: 1.45 }}>
                  {pacienteVisor.enfermedades_hereditarias || 'Sin antecedentes patológicos familiares de relevancia declarados.'}
                </div>
              </div>

              {/* ANTECEDENTES PATOLÓGICOS PERSONALES */}
              <div style={{ background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '1rem' }}>
                <div style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 800, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.45rem' }}>
                  <Activity size={15} color="#475569" />
                  Patologías Personales Previas
                </div>
                <div style={{ fontSize: '0.82rem', color: '#0f172a', lineHeight: 1.45 }}>
                  {pacienteVisor.antecedentes_patologicos || 'Sin patologías crónicas previas registradas en expediente.'}
                </div>
              </div>

              {/* ANTECEDENTES QUIRÚRGICOS */}
              <div style={{ background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '1rem' }}>
                <div style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 800, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.45rem' }}>
                  <Stethoscope size={15} color="#475569" />
                  Antecedentes Quirúrgicos
                </div>
                <div style={{ fontSize: '0.82rem', color: '#0f172a', lineHeight: 1.45 }}>
                  {pacienteVisor.antecedentes_quirurgicos || 'Sin intervenciones quirúrgicas u hospitalizaciones reportadas.'}
                </div>
              </div>
            </div>

            {/* BOTONES INFERIORES */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
              <button
                type="button"
                onClick={cerrarVisor}
                style={{ padding: '0.5rem 1.15rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', color: '#475569' }}
              >
                Cerrar Visor
              </button>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => window.print()}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#334155',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <Printer size={15} />
                  Imprimir Ficha Oficial
                </button>

                <button
                  type="button"
                  onClick={() => {
                    cerrarVisor();
                    abrirEdicion(pacienteVisor);
                  }}
                  style={{
                    padding: '0.5rem 1.15rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#0f766e',
                    color: '#ffffff',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <Edit size={15} />
                  Modificar Antecedentes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL DE EDICIÓN DE ANTECEDENTES CLÍNICOS BASE */}
      {modalEdicionAbierto && pacienteSeleccionado && (
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
            width: '100%',
            maxWidth: '680px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '1.75rem',
            boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Stethoscope size={22} color="#0f766e" />
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                    Editar Antecedentes Clínicos Base (CU14)
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Paciente: <strong>{pacienteSeleccionado.nombre_completo}</strong> | CI: {pacienteSeleccionado.ci}
                  </div>
                </div>
              </div>
              <button onClick={cerrarEdicion} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#64748b' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* GRUPO SANGUÍNEO */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Grupo Sanguíneo y Factor Rh *
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((gs) => (
                    <button
                      key={gs}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, tipo_sangre: gs }))}
                      style={{
                        padding: '0.4rem 0.9rem',
                        borderRadius: '8px',
                        border: formData.tipo_sangre === gs ? '2px solid #b91c1c' : '1px solid #cbd5e1',
                        background: formData.tipo_sangre === gs ? '#fee2e2' : '#ffffff',
                        color: formData.tipo_sangre === gs ? '#b91c1c' : '#334155',
                        fontWeight: 800,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                      }}
                    >
                      {gs}
                    </button>
                  ))}
                </div>
              </div>

              {/* ALERGIAS MEDICAMENTOSAS */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <ShieldAlert size={15} color="#be123c" />
                    Alergias a Medicamentos (Protocolo RAM)
                  </label>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    Indicar fármacos específicos o 'Ninguna conocida'
                  </span>
                </div>
                <input
                  type="text"
                  value={formData.alergias_medicamentos}
                  onChange={(e) => setFormData((prev) => ({ ...prev, alergias_medicamentos: e.target.value }))}
                  placeholder="Ej. Penicilina, Amoxicilina, Dipirona, o 'Ninguna conocida'..."
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '8px',
                    border: tieneAlergiasReales(formData.alergias_medicamentos) ? '2px solid #be123c' : '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    background: tieneAlergiasReales(formData.alergias_medicamentos) ? '#fff1f2' : '#ffffff',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* ENFERMEDADES HEREDITARIAS */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Enfermedades Hereditarias / Antecedentes Familiares
                </label>
                <textarea
                  rows={2}
                  value={formData.enfermedades_hereditarias}
                  onChange={(e) => setFormData((prev) => ({ ...prev, enfermedades_hereditarias: e.target.value }))}
                  placeholder="Madre con Diabetes Mellitus tipo 2, Padre hipertenso..."
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>

              {/* ANTECEDENTES PATOLÓGICOS */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Antecedentes Patológicos Personales
                </label>
                <textarea
                  rows={2}
                  value={formData.antecedentes_patologicos}
                  onChange={(e) => setFormData((prev) => ({ ...prev, antecedentes_patologicos: e.target.value }))}
                  placeholder="Asma bronquial en la infancia, gastritis crónica..."
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>

              {/* ANTECEDENTES QUIRÚRGICOS */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Antecedentes Quirúrgicos
                </label>
                <input
                  type="text"
                  value={formData.antecedentes_quirurgicos}
                  onChange={(e) => setFormData((prev) => ({ ...prev, antecedentes_quirurgicos: e.target.value }))}
                  placeholder="Apendicectomía (2018), Colecistectomía laparoscópica (2022)..."
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            {/* BOTONES ACCIÓN */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                onClick={cerrarEdicion}
                style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '0.82rem', cursor: 'pointer' }}
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={guardando}
                onClick={guardarAntecedentes}
                style={{
                  padding: '0.55rem 1.25rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#0f766e',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  cursor: guardando ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <Save size={16} />
                {guardando ? 'Guardando...' : 'Guardar Antecedentes Base'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CU14_AntecedentesView;
