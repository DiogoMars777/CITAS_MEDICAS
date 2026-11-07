const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  ShadingType,
  BorderStyle,
  TextRun,
  HeadingLevel,
} = require('./frontend/node_modules/docx');

// Color de cabecera según la imagen: Celeste suave (#A6C9EC o #B8D8F8)
const COLOR_HEADER_BG = 'A6C9EC';
const COLOR_ALT_ROW_BG = 'D6E7FA';
const COLOR_WHITE = 'FFFFFF';
const COLOR_TITLE_BG = 'B8D8F8';

const blackBorder = {
  style: BorderStyle.SINGLE,
  size: 8,
  color: '000000',
};

const tableBorders = {
  top: blackBorder,
  bottom: blackBorder,
  left: blackBorder,
  right: blackBorder,
  insideHorizontal: blackBorder,
  insideVertical: blackBorder,
};

const noBorder = {
  style: BorderStyle.NONE,
  size: 0,
  color: 'FFFFFF',
};

function createTableSection(tableData) {
  const elements = [];

  // Título de la tabla: "Tabla: NombreTabla"
  elements.push(
    new Paragraph({
      spacing: { before: 280, after: 120 },
      children: [
        new TextRun({
          text: `Tabla: ${tableData.nombre}`,
          bold: true,
          size: 24, // 12pt
          color: '000000',
          shading: {
            type: ShadingType.CLEAR,
            fill: COLOR_TITLE_BG,
          },
        }),
      ],
    })
  );

  const colCount = tableData.columnas.length;
  // Ancho porcentual equitativo o proporcional
  const colWidthPct = Math.floor(100 / colCount);

  // Fila 0: Indicadores PK / FK
  const indicatorCells = tableData.columnas.map((col) => {
    const isPk = Boolean(col.pk);
    const isFk = Boolean(col.fk);
    let label = '';
    if (isPk && isFk) label = 'pk, fk';
    else if (isPk) label = 'pk';
    else if (isFk) label = 'fk';

    return new TableCell({
      width: { size: colWidthPct, type: WidthType.PERCENTAGE },
      shading: label
        ? { type: ShadingType.CLEAR, fill: COLOR_HEADER_BG }
        : { type: ShadingType.CLEAR, fill: COLOR_WHITE },
      borders: label
        ? {
            top: blackBorder,
            bottom: blackBorder,
            left: blackBorder,
            right: blackBorder,
          }
        : {
            top: noBorder,
            bottom: noBorder,
            left: noBorder,
            right: noBorder,
          },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: label,
              bold: true,
              size: 20, // 10pt
              color: '000000',
            }),
          ],
        }),
      ],
    });
  });

  // Fila 1: Nombres de columnas
  const headerCells = tableData.columnas.map((col) => {
    return new TableCell({
      width: { size: colWidthPct, type: WidthType.PERCENTAGE },
      shading: { type: ShadingType.CLEAR, fill: COLOR_HEADER_BG },
      borders: {
        top: blackBorder,
        bottom: blackBorder,
        left: blackBorder,
        right: blackBorder,
      },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: col.nombre,
              bold: true,
              size: 20, // 10pt
              color: '000000',
            }),
          ],
        }),
      ],
    });
  });

  // Filas de datos
  const dataRows = (tableData.filas || []).map((rowValues, rowIndex) => {
    const rowBg = rowIndex % 2 === 1 ? COLOR_ALT_ROW_BG : COLOR_WHITE;
    const cells = rowValues.map((val) => {
      return new TableCell({
        width: { size: colWidthPct, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: rowBg },
        borders: {
          top: blackBorder,
          bottom: blackBorder,
          left: blackBorder,
          right: blackBorder,
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: String(val !== null && val !== undefined ? val : 'NULL'),
                size: 19, // 9.5pt
                color: '000000',
              }),
            ],
          }),
        ],
      });
    });

    return new TableRow({
      children: cells,
    });
  });

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({ children: indicatorCells }),
      new TableRow({ children: headerCells }),
      ...dataRows,
    ],
  });

  elements.push(table);
  elements.push(new Paragraph({ spacing: { after: 180 }, children: [] }));

  return elements;
}

// --------------------------------------------------------------------------
// DEFINICIÓN DE TABLAS
// --------------------------------------------------------------------------
const tables = [
  // 1. Rol
  {
    nombre: 'Rol',
    columnas: [
      { nombre: 'idRol', pk: true },
      { nombre: 'nombre' },
      { nombre: 'descripción' },
    ],
    filas: [
      ['1', 'Administrador', 'Control total del sistema'],
      ['2', 'Cajero', 'Gestión de cobros y pagos de clientes'],
    ],
  },

  // 2. Permiso
  {
    nombre: 'Permiso',
    columnas: [
      { nombre: 'idPermiso', pk: true },
      { nombre: 'nombre' },
      { nombre: 'descripción' },
    ],
    filas: [
      ['1', 'Gestionar Clientes', 'Permite crear y editar clientes'],
      ['2', 'Ver Reportes', 'Permite visualizar reportes financieros'],
    ],
  },

  // 3. Usuario
  {
    nombre: 'Usuario',
    columnas: [
      { nombre: 'idUsuario', pk: true },
      { nombre: 'nombreUsuario' },
      { nombre: 'passwordHash' },
      { nombre: 'nombreCompleto' },
      { nombre: 'telefono' },
      { nombre: 'correo' },
      { nombre: 'activo' },
      { nombre: 'fechaCreacion' },
      { nombre: 'idRol', fk: true },
    ],
    filas: [
      ['1', 'jperez', '$2b$10$hashEjemplo01', 'Juan Pérez Rocha', '70123456', 'jperez@telcom.com.bo', 'true', '2024-01-15', '1'],
      ['2', 'mrojas', '$2b$10$hashEjemplo02', 'María Rojas Moron', '70654321', 'mrojas@telcom.com.bo', 'true', '2024-03-10', '2'],
    ],
  },

  // 4. RolPermiso
  {
    nombre: 'RolPermiso',
    columnas: [
      { nombre: 'idRolPermiso', pk: true },
      { nombre: 'idRol', fk: true },
      { nombre: 'idPermiso', fk: true },
    ],
    filas: [
      ['1', '1', '1'],
      ['2', '1', '2'],
    ],
  },

  // 5. Bitacora
  {
    nombre: 'Bitacora',
    columnas: [
      { nombre: 'idBitacora', pk: true },
      { nombre: 'fechaHora' },
      { nombre: 'acción' },
      { nombre: 'modulo' },
      { nombre: 'descripción' },
      { nombre: 'ipUsuario' },
      { nombre: 'idUsuario', fk: true },
    ],
    filas: [
      ['1', '2026-08-01 09:15', 'INSERT', 'Clientes', 'Registro de nuevo cliente', '192.168.1.10', '1'],
      ['2', '2026-08-01 10:30', 'UPDATE', 'Pagos', 'Actualización de pago registrado', '192.168.1.12', '2'],
    ],
  },

  // 6. Cliente
  {
    nombre: 'Cliente',
    columnas: [
      { nombre: 'idCliente', pk: true },
      { nombre: 'codigoCliente' },
      { nombre: 'ci' },
      { nombre: 'nombreCompleto' },
      { nombre: 'telefonoPrincipal' },
      { nombre: 'telefonoSecundario' },
      { nombre: 'email' },
      { nombre: 'fechaRegistro' },
      { nombre: 'estadoCliente' },
    ],
    filas: [
      ['1', 'CLI-0001', '5487213', 'Carlos Fernández Vaca', '70111222', '3-345678', 'carlos.fernandez@gmail.com', '2024-02-01', 'Activo'],
      ['2', 'CLI-0002', '6392841', 'Ana Gutiérrez Suárez', '70222333', 'NULL', 'ana.gutierrez@gmail.com', '2024-02-15', 'Activo'],
    ],
  },

  // 7. Zona
  {
    nombre: 'Zona',
    columnas: [
      { nombre: 'idZona', pk: true },
      { nombre: 'nombreZona' },
      { nombre: 'descripción' },
      { nombre: 'estado' },
    ],
    filas: [
      ['1', 'Zona Norte', 'Av. Banzer y anillos externos', 'Activo'],
      ['2', 'Zona Este', 'Av. Grigotá y zona Palmasola', 'Activo'],
    ],
  },

  // 8. EstadoServicio
  {
    nombre: 'EstadoServicio',
    columnas: [
      { nombre: 'idEstadoServicio', pk: true },
      { nombre: 'nombreEstado' },
      { nombre: 'descripción' },
    ],
    filas: [
      ['1', 'Activo', 'Servicio funcionando con normalidad'],
      ['2', 'Suspendido', 'Servicio cortado por falta de pago'],
    ],
  },

  // 9. EstadoCompra
  {
    nombre: 'EstadoCompra',
    columnas: [
      { nombre: 'idEstadoCompra', pk: true },
      { nombre: 'nombreEstado' },
      { nombre: 'descripción' },
    ],
    filas: [
      ['1', 'Recibida', 'Compra recibida en almacén'],
      ['2', 'Pendiente', 'Compra en tránsito'],
    ],
  },

  // ------------------------------------------------------------------------
  // TABLAS CLÍNICA VIDA SALUD (SISTEMA INTEGRAL DE CITAS MÉDICAS)
  // ------------------------------------------------------------------------
  // 10. Especialidad
  {
    nombre: 'Especialidad',
    columnas: [
      { nombre: 'idEspecialidad', pk: true },
      { nombre: 'nombre' },
      { nombre: 'descripcion' },
      { nombre: 'estado' },
    ],
    filas: [
      ['1', 'Medicina General', 'Atención médica primaria integral para adultos', 'ACTIVO'],
      ['2', 'Pediatría', 'Atención integral de salud infantil', 'ACTIVO'],
    ],
  },

  // 11. Medico
  {
    nombre: 'Medico',
    columnas: [
      { nombre: 'idMedico', pk: true },
      { nombre: 'idUsuario', fk: true },
      { nombre: 'numeroRegistroProfesional' },
      { nombre: 'nombres' },
      { nombre: 'apellidos' },
      { nombre: 'telefono' },
      { nombre: 'email' },
      { nombre: 'estado' },
      { nombre: 'fechaIngreso' },
    ],
    filas: [
      ['1', '3', 'MP-98432', 'Carlos Alberto', 'Mendoza Suárez', '70012345', 'medico@clinicavidasalud.com', 'ACTIVO', '2025-10-24'],
      ['2', '5', 'MP-77210', 'Laura Elena', 'Ríos Vargas', '71098765', 'lrios@clinicavidasalud.com', 'ACTIVO', '2026-01-15'],
    ],
  },

  // 12. MedicoEspecialidad
  {
    nombre: 'MedicoEspecialidad',
    columnas: [
      { nombre: 'idMedico', pk: true, fk: true },
      { nombre: 'idEspecialidad', pk: true, fk: true },
      { nombre: 'esPrincipal' },
    ],
    filas: [
      ['1', '1', 'true'],
      ['1', '2', 'false'],
    ],
  },

  // 13. Paciente
  {
    nombre: 'Paciente',
    columnas: [
      { nombre: 'idPaciente', pk: true },
      { nombre: 'idUsuario', fk: true },
      { nombre: 'ci' },
      { nombre: 'nombres' },
      { nombre: 'apellidos' },
      { nombre: 'fechaNacimiento' },
      { nombre: 'sexo' },
      { nombre: 'telefono' },
      { nombre: 'email' },
      { nombre: 'primeraVisita' },
      { nombre: 'estado' },
    ],
    filas: [
      ['1', '4', '87654321', 'Juan Pablo', 'Pérez Gómez', '1990-05-15', 'MASCULINO', '75598765', 'paciente@clinicavidasalud.com', 'false', 'ACTIVO'],
      ['2', 'NULL', '65432109', 'Andrea Sofía', 'Morales Paz', '1995-11-20', 'FEMENINO', '76612345', 'andrea.morales@gmail.com', 'true', 'ACTIVO'],
    ],
  },

  // 14. ContactoEmergencia
  {
    nombre: 'ContactoEmergencia',
    columnas: [
      { nombre: 'idContacto', pk: true },
      { nombre: 'idPaciente', fk: true },
      { nombre: 'nombreCompleto' },
      { nombre: 'parentesco' },
      { nombre: 'telefono' },
      { nombre: 'direccion' },
    ],
    filas: [
      ['1', '1', 'Elena Gómez Vda. de Pérez', 'Madre', '70099887', 'Av. Las Américas #450'],
      ['2', '2', 'Roberto Morales', 'Padre', '70122334', 'Calle Independencia #120'],
    ],
  },

  // 15. HistoriaClinica
  {
    nombre: 'HistoriaClinica',
    columnas: [
      { nombre: 'idHistoriaClinica', pk: true },
      { nombre: 'idPaciente', fk: true },
      { nombre: 'numeroExpediente' },
      { nombre: 'tipoSangre' },
      { nombre: 'alergiasMedicamentos' },
      { nombre: 'enfermedadesHereditarias' },
      { nombre: 'fechaApertura' },
    ],
    filas: [
      ['1', '1', 'EXP-2026-0001', 'O+', 'Penicilina, Sulfas', 'Hipertensión arterial', '2026-01-10 08:30'],
      ['2', '2', 'EXP-2026-0002', 'A+', 'Ninguna conocida', 'Diabetes Mellitus tipo 2', '2026-02-14 10:15'],
    ],
  },

  // 16. TurnoMedico
  {
    nombre: 'TurnoMedico',
    columnas: [
      { nombre: 'idTurno', pk: true },
      { nombre: 'idMedico', fk: true },
      { nombre: 'diaSemana' },
      { nombre: 'horaInicio' },
      { nombre: 'horaFin' },
      { nombre: 'duracionBloqueMin' },
      { nombre: 'estado' },
    ],
    filas: [
      ['1', '1', '1 (Lunes)', '08:00:00', '12:00:00', '15', 'ACTIVO'],
      ['2', '1', '3 (Miércoles)', '14:00:00', '18:00:00', '15', 'ACTIVO'],
    ],
  },

  // 17. BloqueoAgenda
  {
    nombre: 'BloqueoAgenda',
    columnas: [
      { nombre: 'idBloqueo', pk: true },
      { nombre: 'idMedico', fk: true },
      { nombre: 'fechaInicio' },
      { nombre: 'horaInicio' },
      { nombre: 'fechaFin' },
      { nombre: 'horaFin' },
      { nombre: 'motivo' },
      { nombre: 'creadoPor', fk: true },
    ],
    filas: [
      ['1', '1', '2026-11-02', '08:00:00', '2026-11-02', '18:00:00', 'Feriado Nacional - Día de los Difuntos', '1'],
      ['2', '1', '2026-11-15', '09:00:00', '2026-11-15', '12:00:00', 'Cirugía programada en quirófano B', '1'],
    ],
  },

  // 18. Cita
  {
    nombre: 'Cita',
    columnas: [
      { nombre: 'idCita', pk: true },
      { nombre: 'codigoCita' },
      { nombre: 'idPaciente', fk: true },
      { nombre: 'idMedico', fk: true },
      { nombre: 'idEspecialidad', fk: true },
      { nombre: 'fechaCita' },
      { nombre: 'horaInicio' },
      { nombre: 'horaFin' },
      { nombre: 'estadoCita' },
      { nombre: 'creadoPor', fk: true },
    ],
    filas: [
      ['1', 'CITA-20261025-001', '1', '1', '1', '2026-10-25', '08:30:00', '08:45:00', 'CONFIRMADA', '2'],
      ['2', 'CITA-20261025-002', '2', '1', '1', '2026-10-25', '09:00:00', '09:15:00', 'PENDIENTE', '2'],
    ],
  },

  // 19. Reserva
  {
    nombre: 'Reserva',
    columnas: [
      { nombre: 'idReserva', pk: true },
      { nombre: 'idCita', fk: true },
      { nombre: 'idPaciente', fk: true },
      { nombre: 'tokenReserva' },
      { nombre: 'fechaExpiracion' },
      { nombre: 'estadoReserva' },
    ],
    filas: [
      ['1', '1', '1', 'tok_8f93a4b2c1d0', '2026-10-24 16:45:00', 'CONFIRMADA'],
      ['2', '2', '2', 'tok_7e12c9b4a5f3', '2026-10-24 17:00:00', 'EN_ESPERA'],
    ],
  },

  // 20. AtencionMedica
  {
    nombre: 'AtencionMedica',
    columnas: [
      { nombre: 'idAtencion', pk: true },
      { nombre: 'idCita', fk: true },
      { nombre: 'idHistoriaClinica', fk: true },
      { nombre: 'idMedico', fk: true },
      { nombre: 'motivoConsulta' },
      { nombre: 'diagnosticoCie10' },
      { nombre: 'tratamiento' },
      { nombre: 'fechaAtencion' },
    ],
    filas: [
      ['1', '1', '1', '1', 'Control de presión arterial y cefalea', 'I10 (Hipertensión)', 'Losartán 50mg cada 12h', '2026-10-25 08:40'],
      ['2', '2', '2', '1', 'Fiebre persistente y malestar general', 'J00 (Rinofaringitis aguda)', 'Paracetamol 500mg cada 8h', '2026-10-25 09:10'],
    ],
  },

  // 21. HistorialReprogramacion
  {
    nombre: 'HistorialReprogramacion',
    columnas: [
      { nombre: 'idReprogramacion', pk: true },
      { nombre: 'idCita', fk: true },
      { nombre: 'fechaAnterior' },
      { nombre: 'horaInicioAnterior' },
      { nombre: 'fechaNueva' },
      { nombre: 'horaInicioNueva' },
      { nombre: 'motivoReprogramacion' },
      { nombre: 'idUsuarioResponsable', fk: true },
    ],
    filas: [
      ['1', '1', '2026-10-24', '10:00:00', '2026-10-25', '08:30:00', 'Paciente solicitó cambio por horario laboral', '2'],
      ['2', '2', '2026-10-24', '11:15:00', '2026-10-25', '09:00:00', 'Ajuste de agenda médica por reunión clínica', '2'],
    ],
  },

  // 22. CancelacionCita
  {
    nombre: 'CancelacionCita',
    columnas: [
      { nombre: 'idCancelacion', pk: true },
      { nombre: 'idCita', fk: true },
      { nombre: 'motivoCancelacion' },
      { nombre: 'idUsuarioResponsable', fk: true },
      { nombre: 'fechaCancelacion' },
    ],
    filas: [
      ['1', '1', 'Paciente no puede asistir por viaje imprevisto', '2', '2026-10-24 15:30:00'],
      ['2', '2', 'Duplicidad de turno registrado en recepción', '1', '2026-10-24 16:10:00'],
    ],
  },

  // 23. LaboratorioEstudio
  {
    nombre: 'LaboratorioEstudio',
    columnas: [
      { nombre: 'idEstudio', pk: true },
      { nombre: 'codigoEstudio' },
      { nombre: 'idPaciente', fk: true },
      { nombre: 'idMedicoSolicitante', fk: true },
      { nombre: 'idCita', fk: true },
      { nombre: 'nombreEstudio' },
      { nombre: 'tipoEstudio' },
      { nombre: 'estado' },
    ],
    filas: [
      ['1', 'EST-2026-0045', '1', '1', '1', 'Hemograma Completo', 'Análisis Sanguíneo', 'COMPLETADO'],
      ['2', 'EST-2026-0046', '2', '1', '2', 'Perfil Lipídico', 'Bioquímica Clínica', 'PENDIENTE'],
    ],
  },

  // 24. Recordatorio
  {
    nombre: 'Recordatorio',
    columnas: [
      { nombre: 'idRecordatorio', pk: true },
      { nombre: 'idCita', fk: true },
      { nombre: 'tipoCanal' },
      { nombre: 'fechaProgramada' },
      { nombre: 'fechaEnvio' },
      { nombre: 'estadoEnvio' },
      { nombre: 'intentos' },
    ],
    filas: [
      ['1', '1', 'WHATSAPP', '2026-10-24 20:00:00', '2026-10-24 20:01:15', 'ENVIADO', '1'],
      ['2', '2', 'EMAIL', '2026-10-24 21:00:00', 'NULL', 'PENDIENTE', '0'],
    ],
  },
];

// --------------------------------------------------------------------------
// GENERAR DOCUMENTO WORD
// --------------------------------------------------------------------------
async function generateDocx() {
  const docChildren = [
    new Paragraph({
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: 'MAPEO DE BASE DE DATOS RELACIONAL',
          bold: true,
          size: 32,
          color: '1E3A8A',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: 'Diccionario de Datos con Claves Primarias (PK), Foráneas (FK) y Registros de Ejemplo',
          italics: true,
          size: 22,
          color: '475569',
        }),
      ],
    }),
  ];

  for (const tableData of tables) {
    const tableElements = createTableSection(tableData);
    docChildren.push(...tableElements);
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720,    // 0.5 pulgada
              bottom: 720,
              left: 720,
              right: 720,
            },
          },
        },
        children: docChildren,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.resolve(__dirname, 'Mapeo_Base_de_Datos.docx');
  fs.writeFileSync(outputPath, buffer);
  console.log(`Documento Word generado exitosamente en: ${outputPath}`);
}

generateDocx().catch((err) => {
  console.error('Error generando Word:', err);
  process.exit(1);
});
