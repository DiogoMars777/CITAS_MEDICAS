Add-Type -AssemblyName System.Drawing

$targetDir = $PSScriptRoot
if (-not $targetDir) { $targetDir = (Get-Location).Path }

function Generate-Diagram {
    param(
        [string]$cuCode,
        [string]$title,
        [string]$actorName,
        [hashtable]$uiClass,
        [hashtable]$ctrlClass,
        [hashtable[]]$entities,
        [hashtable[]]$connections
    )

    $width = 1750
    $height = 1050
    $bmp = New-Object System.Drawing.Bitmap $width, $height
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

    # 1. White background
    $g.Clear([System.Drawing.Color]::White)

    # 2. Outer diagram boundary box
    $outerPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(40, 40, 40), 1.5)
    $g.DrawRectangle($outerPen, 25, 25, $width - 50, $height - 50)

    # 3. Top-left EA-style frame tag
    $tagFont = New-Object System.Drawing.Font("Arial", 9.5, [System.Drawing.FontStyle]::Bold)
    $tagBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(30, 30, 30))
    $tagText = "class ${cuCode}: $title"
    $g.DrawString($tagText, $tagFont, $tagBrush, 34, 30)

    $tagWidth = [Math]::Max(420, ($tagText.Length * 7.5))
    $tagPoly = @(
        [System.Drawing.Point]::new(25, 48),
        [System.Drawing.Point]::new([int]$tagWidth, 48),
        [System.Drawing.Point]::new([int]($tagWidth + 15), 25)
    )
    $g.DrawLines($outerPen, $tagPoly)

    # Watermark background text (EA style)
    $wmFont = New-Object System.Drawing.Font("Arial", 8.5, [System.Drawing.FontStyle]::Regular)
    $wmBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(15, 0, 0, 0))
    for ($wy = 60; $wy -lt ($height - 50); $wy += 42) {
        for ($wx = 30; $wx -lt ($width - 150); $wx += 280) {
            $g.DrawString("EA 17.2 Unregistered Trial Version", $wmFont, $wmBrush, $wx, $wy)
        }
    }

    # Fonts
    $fontClassName = New-Object System.Drawing.Font("Arial", 10.5, [System.Drawing.FontStyle]::Bold)
    $fontMember = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Regular)
    $fontMultiplicity = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Bold)
    $fontActor = New-Object System.Drawing.Font("Arial", 9, [System.Drawing.FontStyle]::Bold)

    # Pens & Brushes
    $borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(158, 123, 102), 1.2)
    $divPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(190, 160, 140), 1.0)
    $linePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(120, 120, 120), 1.2)
    $dashedPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(120, 120, 120), 1.2)
    $dashedPen.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dash
    $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(25, 25, 25))
    $actorBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(250, 220, 195))
    $actorBorderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(160, 100, 70), 1.5)

    # Helper function to draw an EA class box
    function Draw-Box {
        param($def)
        $name = $def.Name
        $attributes = $def.Attributes
        $methods = $def.Methods
        $x = $def.X
        $y = $def.Y
        $w = $def.W

        $headerH = 28
        $attrH = if ($attributes.Length -gt 0) { ($attributes.Length * 17) + 8 } else { 10 }
        $methodH = if ($methods.Length -gt 0) { ($methods.Length * 17) + 8 } else { 10 }
        $totalH = $headerH + $attrH + $methodH

        $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $totalH)

        $colorTop = [System.Drawing.Color]::FromArgb(255, 252, 247)
        $colorBottom = [System.Drawing.Color]::FromArgb(254, 237, 224)
        $gradBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $colorTop, $colorBottom, 90.0)

        $g.FillRectangle($gradBrush, $rect)
        $g.DrawRectangle($borderPen, $rect)

        # Header string
        $sfHeader = New-Object System.Drawing.StringFormat
        $sfHeader.Alignment = [System.Drawing.StringAlignment]::Center
        $sfHeader.LineAlignment = [System.Drawing.StringAlignment]::Center
        $headerRect = [System.Drawing.RectangleF]::new($x, ($y + 2), $w, 24)
        $g.DrawString($name, $fontClassName, $textBrush, $headerRect, $sfHeader)

        # Divider 1
        $div1Y = $y + $headerH
        $g.DrawLine($divPen, $x, $div1Y, $x + $w, $div1Y)

        # Attributes
        $currY = $div1Y + 5
        foreach ($attr in $attributes) {
            $g.DrawString($attr, $fontMember, $textBrush, ($x + 8), $currY)
            $currY += 17
        }

        # Divider 2
        $div2Y = $y + $headerH + $attrH
        $g.DrawLine($divPen, $x, $div2Y, $x + $w, $div2Y)

        # Methods
        $currY = $div2Y + 5
        foreach ($m in $methods) {
            $g.DrawString($m, $fontMember, $textBrush, ($x + 8), $currY)
            $currY += 17
        }

        return @{
            Left = $x
            Right = $x + $w
            Top = $y
            Bottom = $y + $totalH
            CenterX = [int]($x + ($w / 2))
            CenterY = [int]($y + ($totalH / 2))
            Width = $w
            Height = $totalH
        }
    }

    # 4. Draw Actor
    $actorX = 65
    $actorY = 480
    $g.FillEllipse($actorBrush, ($actorX - 12), ($actorY - 38), 24, 24)
    $g.DrawEllipse($actorBorderPen, ($actorX - 12), ($actorY - 38), 24, 24)
    $g.DrawLine($actorBorderPen, $actorX, ($actorY - 14), $actorX, ($actorY + 18))
    $g.DrawLine($actorBorderPen, ($actorX - 22), ($actorY - 3), ($actorX + 22), ($actorY - 3))
    $g.DrawLine($actorBorderPen, $actorX, ($actorY + 18), ($actorX - 16), ($actorY + 44))
    $g.DrawLine($actorBorderPen, $actorX, ($actorY + 18), ($actorX + 16), ($actorY + 44))

    $sfActor = New-Object System.Drawing.StringFormat
    $sfActor.Alignment = [System.Drawing.StringAlignment]::Center
    $actorTextRect = [System.Drawing.RectangleF]::new(($actorX - 75), ($actorY + 48), 150, 40)
    $g.DrawString($actorName, $fontActor, $textBrush, $actorTextRect, $sfActor)

    # 5. Draw UI Boundary Box
    $uiBox = Draw-Box $uiClass

    # 6. Draw Controller Box
    $ctrlBox = Draw-Box $ctrlClass

    # 7. Draw Entity Boxes
    $entityBoxes = @{}
    foreach ($ent in $entities) {
        $b = Draw-Box $ent
        $entityBoxes[$ent.Name] = $b
    }

    # 8. Draw Connections
    # Actor to UI line
    $g.DrawLine($linePen, ($actorX + 22), ($actorY + 2), $uiBox.Left, ($actorY + 2))

    # UI to Controller line
    $g.DrawLine($linePen, $uiBox.Right, $ctrlBox.CenterY, $ctrlBox.Left, $ctrlBox.CenterY)

    # Connections between classes
    foreach ($conn in $connections) {
        $fromBox = if ($conn.From -eq "Ctrl") { $ctrlBox } else { $entityBoxes[$conn.From] }
        $toBox = $entityBoxes[$conn.To]
        $p = if ($conn.Dashed) { $dashedPen } else { $linePen }

        if ($conn.Type -eq "Horizontal") {
            $yPos = if ($conn.YOffset) { $fromBox.Top + $conn.YOffset } else { $fromBox.CenterY }
            $g.DrawLine($p, $fromBox.Right, $yPos, $toBox.Left, $yPos)
            if ($conn.MultFrom) {
                $g.DrawString($conn.MultFrom, $fontMultiplicity, $textBrush, ($fromBox.Right + 5), ($yPos - 18))
            }
            if ($conn.MultTo) {
                $g.DrawString($conn.MultTo, $fontMultiplicity, $textBrush, ($toBox.Left - 32), ($yPos - 18))
            }
        }
        elseif ($conn.Type -eq "VerticalUp") {
            # fromBox to toBox above
            $xPos = if ($conn.XOffset) { $fromBox.CenterX + $conn.XOffset } else { $fromBox.CenterX }
            $g.DrawLine($p, $xPos, $fromBox.Top, $xPos, $toBox.Bottom)
            if ($conn.MultFrom) {
                $g.DrawString($conn.MultFrom, $fontMultiplicity, $textBrush, ($xPos + 5), ($fromBox.Top - 18))
            }
            if ($conn.MultTo) {
                $g.DrawString($conn.MultTo, $fontMultiplicity, $textBrush, ($xPos + 5), ($toBox.Bottom + 5))
            }
        }
        elseif ($conn.Type -eq "VerticalDown") {
            # fromBox to toBox below
            $xPos = if ($conn.XOffset) { $fromBox.CenterX + $conn.XOffset } else { $fromBox.CenterX }
            $g.DrawLine($p, $xPos, $fromBox.Bottom, $xPos, $toBox.Top)
            if ($conn.MultFrom) {
                $g.DrawString($conn.MultFrom, $fontMultiplicity, $textBrush, ($xPos + 5), ($fromBox.Bottom + 5))
            }
            if ($conn.MultTo) {
                $g.DrawString($conn.MultTo, $fontMultiplicity, $textBrush, ($xPos + 5), ($toBox.Top - 18))
            }
        }
        elseif ($conn.Type -eq "RightToTop") {
            # Route: right of fromBox, then turn to top of toBox
            $g.DrawLine($p, $fromBox.Right, $fromBox.CenterY, $toBox.CenterX, $fromBox.CenterY)
            $g.DrawLine($p, $toBox.CenterX, $fromBox.CenterY, $toBox.CenterX, $toBox.Top)
            if ($conn.MultTo) {
                $g.DrawString($conn.MultTo, $fontMultiplicity, $textBrush, ($toBox.CenterX + 5), ($toBox.Top - 18))
            }
        }
    }

    # 9. Save file
    $fileName = "Diagrama_Analisis_Clases_$cuCode.png"
    $savePath = Join-Path $targetDir $fileName
    $bmp.Save($savePath, [System.Drawing.Imaging.ImageFormat]::Png)

    $g.Dispose()
    $bmp.Dispose()
    Write-Output "Successfully generated: $fileName"
}

# ==============================================================================
# CU13: Control de asistencia a citas médicas
# ==============================================================================
Generate-Diagram `
    -cuCode "CU13" `
    -title "Control de asistencia y llegadas a citas médicas" `
    -actorName "Recepcionista" `
    -uiClass @{
        Name = "UI_ControlAsistencia"
        X = 185; Y = 425; W = 225
        Attributes = @()
        Methods = @(
            "+ consultarCitasDelDia(): void",
            "+ filtrarPorEstado(): void",
            "+ marcarAsistencia(): void",
            "+ marcarInasistencia(): void",
            "+ seleccionarCita(): void"
        )
    } `
    -ctrlClass @{
        Name = "AsistenciaController"
        X = 450; Y = 430; W = 265
        Attributes = @()
        Methods = @(
            "+ index(req: Request): JsonResponse",
            "+ registrarAsistencia(id: int): JsonResponse"
        )
    } `
    -entities @(
        @{
            Name = "Cita"
            X = 765; Y = 360; W = 260
            Attributes = @(
                "- id_cita: bigint",
                "- codigo_cita: string",
                "- id_paciente: bigint",
                "- id_medico: bigint",
                "- id_especialidad: integer",
                "- fecha_cita: date",
                "- hora_inicio: time",
                "- hora_fin: time",
                "- motivo_consulta: string",
                "- estado_cita: string",
                "- fecha_actualizacion: timestamp"
            )
            Methods = @(
                "+ findOrFail(id: int): Cita",
                "+ lockForUpdate(): QueryBuilder",
                "+ update(attrs: array): boolean"
            )
        },
        @{
            Name = "Paciente"
            X = 780; Y = 100; W = 230
            Attributes = @(
                "- id_paciente: bigint",
                "- ci: string",
                "- nombres: string",
                "- apellidos: string",
                "- telefono: string",
                "- email: string",
                "- estado: string"
            )
            Methods = @(
                "+ find(id: bigint): Paciente"
            )
        },
        @{
            Name = "Medico"
            X = 1100; Y = 390; W = 250
            Attributes = @(
                "- id_medico: bigint",
                "- numero_registro_profesional: string",
                "- nombres: string",
                "- apellidos: string",
                "- telefono: string",
                "- estado: string"
            )
            Methods = @(
                "+ find(id: bigint): Medico"
            )
        },
        @{
            Name = "BitacoraAuditoria"
            X = 765; Y = 740; W = 260
            Attributes = @(
                "- id_bitacora: bigint",
                "- id_usuario: bigint",
                "- modulo: string",
                "- operacion: string",
                "- tabla_afectada: string",
                "- valores_anteriores: json",
                "- valores_nuevos: json",
                "- direccion_ip: string",
                "- fecha_creacion: timestamp"
            )
            Methods = @(
                "+ registrar(): BitacoraAuditoria"
            )
        }
    ) `
    -connections @(
        @{ From = "Ctrl"; To = "Cita"; Type = "Horizontal" },
        @{ From = "Cita"; To = "Paciente"; Type = "VerticalUp"; MultFrom = "1"; MultTo = "1" },
        @{ From = "Cita"; To = "Medico"; Type = "Horizontal"; MultFrom = "0..*"; MultTo = "1" },
        @{ From = "Cita"; To = "BitacoraAuditoria"; Type = "VerticalDown"; MultFrom = "1"; MultTo = "0..*" }
    )

# ==============================================================================
# CU14: Registrar y actualizar antecedentes clínicos base
# ==============================================================================
Generate-Diagram `
    -cuCode "CU14" `
    -title "Registrar y actualizar antecedentes clínicos base" `
    -actorName "Médico / Recepcionista" `
    -uiClass @{
        Name = "UI_AntecedentesClinicos"
        X = 185; Y = 430; W = 225
        Attributes = @()
        Methods = @(
            "+ consultarExpedientes(): void",
            "+ seleccionarPaciente(): void",
            "+ visualizarFichaClinica(): void",
            "+ registrarAntecedentes(): void",
            "+ actualizarExpediente(): void"
        )
    } `
    -ctrlClass @{
        Name = "AntecedentesClinicosController"
        X = 450; Y = 435; W = 265
        Attributes = @()
        Methods = @(
            "+ index(req: Request): JsonResponse",
            "+ show(idPaciente: bigint): JsonResponse",
            "+ update(req: Request): JsonResponse"
        )
    } `
    -entities @(
        @{
            Name = "Paciente"
            X = 760; Y = 360; W = 250
            Attributes = @(
                "- id_paciente: bigint",
                "- id_usuario: bigint",
                "- ci: string",
                "- nombres: string",
                "- apellidos: string",
                "- fecha_nacimiento: date",
                "- sexo: string",
                "- telefono: string",
                "- email: string",
                "- direccion: string",
                "- primera_visita: boolean",
                "- estado: string"
            )
            Methods = @(
                "+ findOrFail(id: bigint): Paciente",
                "+ lockForUpdate(): QueryBuilder",
                "+ update(data: array): boolean"
            )
        },
        @{
            Name = "HistoriaClinica"
            X = 760; Y = 80; W = 250
            Attributes = @(
                "- id_historia_clinica: bigint",
                "- id_paciente: bigint",
                "- numero_expediente: string",
                "- tipo_sangre: string",
                "- alergias_medicamentos: text",
                "- enfermedades_hereditarias: text",
                "- antecedentes_patologicos: text",
                "- antecedentes_quirurgicos: text",
                "- fecha_apertura: timestamp"
            )
            Methods = @(
                "+ firstOrNew(filter: array): HistoriaClinica",
                "+ save(): boolean"
            )
        },
        @{
            Name = "ContactoEmergencia"
            X = 1080; Y = 420; W = 250
            Attributes = @(
                "- id_contacto: bigint",
                "- id_paciente: bigint",
                "- nombre_completo: string",
                "- parentesco: string",
                "- telefono: string",
                "- direccion: string"
            )
            Methods = @(
                "+ updateOrCreate(key: array, val: array)"
            )
        },
        @{
            Name = "BitacoraAuditoria"
            X = 760; Y = 730; W = 250
            Attributes = @(
                "- id_bitacora: bigint",
                "- id_usuario: bigint",
                "- modulo: string",
                "- operacion: string",
                "- tabla_afectada: string",
                "- valores_anteriores: json",
                "- valores_nuevos: json",
                "- direccion_ip: string",
                "- fecha_creacion: timestamp"
            )
            Methods = @(
                "+ registrar(): BitacoraAuditoria"
            )
        }
    ) `
    -connections @(
        @{ From = "Ctrl"; To = "Paciente"; Type = "Horizontal" },
        @{ From = "Paciente"; To = "HistoriaClinica"; Type = "VerticalUp"; MultFrom = "1"; MultTo = "1" },
        @{ From = "Paciente"; To = "ContactoEmergencia"; Type = "Horizontal"; MultFrom = "1"; MultTo = "0..1" },
        @{ From = "Paciente"; To = "BitacoraAuditoria"; Type = "VerticalDown"; MultFrom = "1"; MultTo = "0..*" }
    )

# ==============================================================================
# CU15: Visualizar agenda médica diaria
# ==============================================================================
Generate-Diagram `
    -cuCode "CU15" `
    -title "Visualizar agenda médica diaria y llamar pacientes" `
    -actorName "Médico" `
    -uiClass @{
        Name = "UI_AgendaDiariaMedico"
        X = 185; Y = 430; W = 225
        Attributes = @()
        Methods = @(
            "+ consultarAgendaHoy(): void",
            "+ filtrarPorFecha(): void",
            "+ seleccionarCita(): void",
            "+ verFichaPaciente(): void",
            "+ llamarPaciente(): void",
            "+ iniciarAtencion(): void"
        )
    } `
    -ctrlClass @{
        Name = "AgendaMedicoController"
        X = 450; Y = 435; W = 265
        Attributes = @()
        Methods = @(
            "+ agendaDiaria(req: Request): JsonResponse",
            "+ expedientePaciente(idCita: int): JsonResponse"
        )
    } `
    -entities @(
        @{
            Name = "Medico"
            X = 765; Y = 380; W = 250
            Attributes = @(
                "- id_medico: bigint",
                "- id_usuario: bigint",
                "- numero_registro_profesional: string",
                "- nombres: string",
                "- apellidos: string",
                "- telefono: string",
                "- email: string",
                "- estado: string"
            )
            Methods = @(
                "+ where(col: string, val: any): QueryBuilder",
                "+ findOrFail(id: bigint): Medico"
            )
        },
        @{
            Name = "Cita"
            X = 1080; Y = 360; W = 260
            Attributes = @(
                "- id_cita: bigint",
                "- codigo_cita: string",
                "- id_paciente: bigint",
                "- id_medico: bigint",
                "- fecha_cita: date",
                "- hora_inicio: time",
                "- hora_fin: time",
                "- motivo_consulta: string",
                "- estado_cita: string"
            )
            Methods = @(
                "+ whereDate(col: string, val: date)",
                "+ with(rel: string): QueryBuilder",
                "+ orderBy(col: string): QueryBuilder"
            )
        },
        @{
            Name = "Paciente"
            X = 1400; Y = 380; W = 230
            Attributes = @(
                "- id_paciente: bigint",
                "- ci: string",
                "- nombres: string",
                "- apellidos: string",
                "- fecha_nacimiento: date",
                "- sexo: string",
                "- telefono: string"
            )
            Methods = @(
                "+ find(id: bigint): Paciente"
            )
        },
        @{
            Name = "HistoriaClinica"
            X = 1400; Y = 100; W = 230
            Attributes = @(
                "- id_historia_clinica: bigint",
                "- id_paciente: bigint",
                "- numero_expediente: string",
                "- tipo_sangre: string",
                "- alergias_medicamentos: text"
            )
            Methods = @(
                "+ where(col: string, val: any): QueryBuilder"
            )
        }
    ) `
    -connections @(
        @{ From = "Ctrl"; To = "Medico"; Type = "Horizontal" },
        @{ From = "Medico"; To = "Cita"; Type = "Horizontal"; MultFrom = "1"; MultTo = "0..*" },
        @{ From = "Cita"; To = "Paciente"; Type = "Horizontal"; MultFrom = "0..*"; MultTo = "1" },
        @{ From = "Paciente"; To = "HistoriaClinica"; Type = "VerticalUp"; MultFrom = "1"; MultTo = "0..1" }
    )

# ==============================================================================
# CU16: Atender consulta y registrar evolución clínica
# ==============================================================================
Generate-Diagram `
    -cuCode "CU16" `
    -title "Atender consulta y registrar evolución clínica" `
    -actorName "Médico" `
    -uiClass @{
        Name = "UI_AtenderConsulta"
        X = 185; Y = 430; W = 225
        Attributes = @()
        Methods = @(
            "+ cargarDatosConsulta(): void",
            "+ revisarAntecedentes(): void",
            "+ registrarSintomas(): void",
            "+ asignarDiagnosticoCIE10(): void",
            "+ prescribirTratamiento(): void",
            "+ finalizarConsulta(): void"
        )
    } `
    -ctrlClass @{
        Name = "AtencionMedicaController"
        X = 450; Y = 435; W = 265
        Attributes = @()
        Methods = @(
            "+ iniciarConsulta(idCita: int): JsonResponse",
            "+ guardarAtencion(idCita: int, req: Request): JsonResponse"
        )
    } `
    -entities @(
        @{
            Name = "AtencionMedica"
            X = 760; Y = 330; W = 270
            Attributes = @(
                "- id_atencion: bigint",
                "- id_cita: bigint",
                "- id_historia_clinica: bigint",
                "- id_medico: bigint",
                "- motivo_consulta: string",
                "- sintomas: text",
                "- diagnostico_cie10: string",
                "- diagnostico_descripcion: text",
                "- tratamiento: text",
                "- receta_medica: text",
                "- fecha_atencion: timestamp"
            )
            Methods = @(
                "+ create(data: array): AtencionMedica",
                "+ where(col: string, val: any): QueryBuilder"
            )
        },
        @{
            Name = "Cita"
            X = 1110; Y = 360; W = 250
            Attributes = @(
                "- id_cita: bigint",
                "- codigo_cita: string",
                "- id_paciente: bigint",
                "- id_medico: bigint",
                "- estado_cita: string",
                "- fecha_cita: date"
            )
            Methods = @(
                "+ findOrFail(id: int): Cita",
                "+ update(data: array): boolean"
            )
        },
        @{
            Name = "HistoriaClinica"
            X = 770; Y = 80; W = 250
            Attributes = @(
                "- id_historia_clinica: bigint",
                "- id_paciente: bigint",
                "- numero_expediente: string",
                "- tipo_sangre: string",
                "- alergias_medicamentos: text",
                "- antecedentes_patologicos: text"
            )
            Methods = @(
                "+ firstOrCreate(filter: array): HistoriaClinica"
            )
        },
        @{
            Name = "BitacoraAuditoria"
            X = 770; Y = 730; W = 250
            Attributes = @(
                "- id_bitacora: bigint",
                "- id_usuario: bigint",
                "- modulo: string",
                "- operacion: string",
                "- tabla_afectada: string",
                "- valores_anteriores: json",
                "- valores_nuevos: json",
                "- fecha_creacion: timestamp"
            )
            Methods = @(
                "+ registrar(): BitacoraAuditoria"
            )
        }
    ) `
    -connections @(
        @{ From = "Ctrl"; To = "AtencionMedica"; Type = "Horizontal" },
        @{ From = "AtencionMedica"; To = "HistoriaClinica"; Type = "VerticalUp"; MultFrom = "0..*"; MultTo = "1" },
        @{ From = "AtencionMedica"; To = "Cita"; Type = "Horizontal"; MultFrom = "1"; MultTo = "1" },
        @{ From = "AtencionMedica"; To = "BitacoraAuditoria"; Type = "VerticalDown"; MultFrom = "1"; MultTo = "0..*" }
    )

# ==============================================================================
# CU17: Cargar estudios y resultados de laboratorio
# ==============================================================================
Generate-Diagram `
    -cuCode "CU17" `
    -title "Cargar estudios y resultados de laboratorio" `
    -actorName "Laboratorista / Recepcionista" `
    -uiClass @{
        Name = "UI_CargaEstudios"
        X = 185; Y = 430; W = 225
        Attributes = @()
        Methods = @(
            "+ buscarPaciente(): void",
            "+ seleccionarTipoEstudio(): void",
            "+ ingresarResultadoTexto(): void",
            "+ adjuntarArchivoPDF(): void",
            "+ publicarEstudio(): void"
        )
    } `
    -ctrlClass @{
        Name = "CargaEstudioController"
        X = 450; Y = 435; W = 265
        Attributes = @()
        Methods = @(
            "+ index(req: Request): JsonResponse",
            "+ buscarPaciente(ident: string): JsonResponse",
            "+ store(req: Request): JsonResponse",
            "+ guardarResultado(id: int, req: Request): JsonResponse"
        )
    } `
    -entities @(
        @{
            Name = "LaboratorioEstudio"
            X = 760; Y = 320; W = 270
            Attributes = @(
                "- id_estudio: bigint",
                "- codigo_estudio: string",
                "- id_paciente: bigint",
                "- id_medico_solicitante: bigint",
                "- id_cita: bigint",
                "- nombre_estudio: string",
                "- tipo_estudio: string",
                "- descripcion: text",
                "- resultado_diagnostico: text",
                "- archivo_resultado_url: string",
                "- estado: string",
                "- publicado_en: timestamp"
            )
            Methods = @(
                "+ create(data: array): LaboratorioEstudio",
                "+ findOrFail(id: int): LaboratorioEstudio",
                "+ update(data: array): boolean"
            )
        },
        @{
            Name = "Paciente"
            X = 1110; Y = 200; W = 240
            Attributes = @(
                "- id_paciente: bigint",
                "- ci: string",
                "- nombres: string",
                "- apellidos: string",
                "- telefono: string"
            )
            Methods = @(
                "+ find(id: bigint): Paciente",
                "+ where(col: string, val: any): QueryBuilder"
            )
        },
        @{
            Name = "Medico"
            X = 1110; Y = 500; W = 240
            Attributes = @(
                "- id_medico: bigint",
                "- numero_registro_profesional: string",
                "- nombres: string",
                "- apellidos: string"
            )
            Methods = @(
                "+ find(id: bigint): Medico"
            )
        },
        @{
            Name = "BitacoraAuditoria"
            X = 770; Y = 750; W = 250
            Attributes = @(
                "- id_bitacora: bigint",
                "- id_usuario: bigint",
                "- modulo: string",
                "- operacion: string",
                "- tabla_afectada: string",
                "- valores_nuevos: json",
                "- fecha_creacion: timestamp"
            )
            Methods = @(
                "+ registrar(): BitacoraAuditoria"
            )
        }
    ) `
    -connections @(
        @{ From = "Ctrl"; To = "LaboratorioEstudio"; Type = "Horizontal" },
        @{ From = "LaboratorioEstudio"; To = "Paciente"; Type = "Horizontal"; YOffset = 50; MultFrom = "0..*"; MultTo = "1" },
        @{ From = "LaboratorioEstudio"; To = "Medico"; Type = "Horizontal"; YOffset = 220; MultFrom = "0..*"; MultTo = "0..1" },
        @{ From = "LaboratorioEstudio"; To = "BitacoraAuditoria"; Type = "VerticalDown"; MultFrom = "1"; MultTo = "0..*" }
    )

# ==============================================================================
# CU18: Visualizar y descargar estudios de laboratorio
# ==============================================================================
Generate-Diagram `
    -cuCode "CU18" `
    -title "Visualizar y descargar estudios de laboratorio" `
    -actorName "Paciente / Médico" `
    -uiClass @{
        Name = "UI_VisualizarEstudios"
        X = 185; Y = 430; W = 225
        Attributes = @()
        Methods = @(
            "+ consultarHistorialEstudios(): void",
            "+ filtrarPorFechaYTipo(): void",
            "+ seleccionarEstudio(): void",
            "+ previsualizarResultado(): void",
            "+ descargarArchivoAdjunto(): void"
        )
    } `
    -ctrlClass @{
        Name = "VisualizarEstudiosController"
        X = 450; Y = 435; W = 265
        Attributes = @()
        Methods = @(
            "+ index(req: Request): JsonResponse",
            "+ show(idEstudio: int): JsonResponse"
        )
    } `
    -entities @(
        @{
            Name = "LaboratorioEstudio"
            X = 760; Y = 340; W = 270
            Attributes = @(
                "- id_estudio: bigint",
                "- codigo_estudio: string",
                "- id_paciente: bigint",
                "- id_medico_solicitante: bigint",
                "- nombre_estudio: string",
                "- tipo_estudio: string",
                "- resultado_diagnostico: text",
                "- archivo_resultado_url: string",
                "- estado: string",
                "- publicado_en: timestamp"
            )
            Methods = @(
                "+ where(col: string, val: any): QueryBuilder",
                "+ findOrFail(id: int): LaboratorioEstudio",
                "+ with(rel: string): QueryBuilder"
            )
        },
        @{
            Name = "Paciente"
            X = 1110; Y = 360; W = 240
            Attributes = @(
                "- id_paciente: bigint",
                "- ci: string",
                "- nombres: string",
                "- apellidos: string",
                "- telefono: string",
                "- email: string"
            )
            Methods = @(
                "+ find(id: bigint): Paciente"
            )
        },
        @{
            Name = "HistoriaClinica"
            X = 1110; Y = 120; W = 240
            Attributes = @(
                "- id_historia_clinica: bigint",
                "- id_paciente: bigint",
                "- numero_expediente: string",
                "- tipo_sangre: string"
            )
            Methods = @(
                "+ where(col: string, val: any): QueryBuilder"
            )
        }
    ) `
    -connections @(
        @{ From = "Ctrl"; To = "LaboratorioEstudio"; Type = "Horizontal" },
        @{ From = "LaboratorioEstudio"; To = "Paciente"; Type = "Horizontal"; MultFrom = "0..*"; MultTo = "1" },
        @{ From = "Paciente"; To = "HistoriaClinica"; Type = "VerticalUp"; MultFrom = "1"; MultTo = "1" }
    )

# ==============================================================================
# CU19: Gestionar recordatorios y notificaciones de citas
# ==============================================================================
Generate-Diagram `
    -cuCode "CU19" `
    -title "Gestionar recordatorios y notificaciones de citas" `
    -actorName "Administrador / Sistema" `
    -uiClass @{
        Name = "UI_GestionRecordatorios"
        X = 185; Y = 430; W = 225
        Attributes = @()
        Methods = @(
            "+ consultarRecordatorios(): void",
            "+ ejecutarEscaneo24h(): void",
            "+ enviarRecordatorioManual(): void",
            "+ reintentarEnvioFallido(): void"
        )
    } `
    -ctrlClass @{
        Name = "RecordatorioController"
        X = 450; Y = 435; W = 265
        Attributes = @()
        Methods = @(
            "+ index(req: Request): JsonResponse",
            "+ escanearProximas24Horas(): JsonResponse",
            "+ reenviar(id: int): JsonResponse",
            "+ store(req: Request): JsonResponse"
        )
    } `
    -entities @(
        @{
            Name = "Recordatorio"
            X = 760; Y = 340; W = 260
            Attributes = @(
                "- id_recordatorio: bigint",
                "- id_cita: bigint",
                "- tipo_canal: string",
                "- fecha_programada: timestamp",
                "- fecha_envio: timestamp",
                "- estado_envio: string",
                "- intentos: integer",
                "- mensaje: text"
            )
            Methods = @(
                "+ create(data: array): Recordatorio",
                "+ where(col: string, val: any): QueryBuilder",
                "+ update(data: array): boolean"
            )
        },
        @{
            Name = "Cita"
            X = 1100; Y = 340; W = 250
            Attributes = @(
                "- id_cita: bigint",
                "- codigo_cita: string",
                "- id_paciente: bigint",
                "- id_medico: bigint",
                "- fecha_cita: date",
                "- hora_inicio: time",
                "- estado_cita: string"
            )
            Methods = @(
                "+ whereBetween(col: string, range: array)",
                "+ with(rel: string): QueryBuilder"
            )
        },
        @{
            Name = "Paciente"
            X = 1420; Y = 360; W = 230
            Attributes = @(
                "- id_paciente: bigint",
                "- ci: string",
                "- nombres: string",
                "- apellidos: string",
                "- telefono: string",
                "- email: string"
            )
            Methods = @(
                "+ find(id: bigint): Paciente"
            )
        },
        @{
            Name = "BitacoraAuditoria"
            X = 760; Y = 740; W = 260
            Attributes = @(
                "- id_bitacora: bigint",
                "- id_usuario: bigint",
                "- modulo: string",
                "- operacion: string",
                "- tabla_afectada: string",
                "- valores_nuevos: json",
                "- fecha_creacion: timestamp"
            )
            Methods = @(
                "+ registrar(): BitacoraAuditoria"
            )
        }
    ) `
    -connections @(
        @{ From = "Ctrl"; To = "Recordatorio"; Type = "Horizontal" },
        @{ From = "Recordatorio"; To = "Cita"; Type = "Horizontal"; MultFrom = "0..*"; MultTo = "1" },
        @{ From = "Cita"; To = "Paciente"; Type = "Horizontal"; MultFrom = "0..*"; MultTo = "1" },
        @{ From = "Recordatorio"; To = "BitacoraAuditoria"; Type = "VerticalDown"; MultFrom = "1"; MultTo = "0..*" }
    )

# ==============================================================================
# CU20: Dashboard operativo y métricas clínicas
# ==============================================================================
Generate-Diagram `
    -cuCode "CU20" `
    -title "Dashboard operativo y métricas clínicas" `
    -actorName "Director Médico / Admin" `
    -uiClass @{
        Name = "UI_DashboardMetricas"
        X = 185; Y = 430; W = 225
        Attributes = @()
        Methods = @(
            "+ visualizarMetricasGenerales(): void",
            "+ filtrarRangoFechas(): void",
            "+ consultarOcupacionMedica(): void",
            "+ revisarTasaCancelacion(): void",
            "+ exportarResumenKPIs(): void"
        )
    } `
    -ctrlClass @{
        Name = "DashboardController"
        X = 450; Y = 435; W = 265
        Attributes = @()
        Methods = @(
            "+ metricas(req: Request): JsonResponse"
        )
    } `
    -entities @(
        @{
            Name = "Cita"
            X = 770; Y = 130; W = 250
            Attributes = @(
                "- id_cita: bigint",
                "- id_medico: bigint",
                "- fecha_cita: date",
                "- estado_cita: string",
                "- fecha_creacion: timestamp"
            )
            Methods = @(
                "+ whereDate(col: string, val: any)",
                "+ count(): int",
                "+ groupBy(col: string): QueryBuilder"
            )
        },
        @{
            Name = "Paciente"
            X = 1090; Y = 130; W = 240
            Attributes = @(
                "- id_paciente: bigint",
                "- primera_visita: boolean",
                "- estado: string",
                "- fecha_creacion: timestamp"
            )
            Methods = @(
                "+ count(): int",
                "+ where(col: string, val: any): QueryBuilder"
            )
        },
        @{
            Name = "Medico"
            X = 770; Y = 620; W = 250
            Attributes = @(
                "- id_medico: bigint",
                "- id_especialidad: integer",
                "- estado: string"
            )
            Methods = @(
                "+ count(): int",
                "+ withCount(rel: string): QueryBuilder"
            )
        },
        @{
            Name = "AtencionMedica"
            X = 1090; Y = 620; W = 240
            Attributes = @(
                "- id_atencion: bigint",
                "- id_cita: bigint",
                "- fecha_atencion: timestamp"
            )
            Methods = @(
                "+ count(): int",
                "+ whereBetween(col: string, r: array)"
            )
        }
    ) `
    -connections @(
        @{ From = "Ctrl"; To = "Cita"; Type = "Horizontal"; Dashed = $true },
        @{ From = "Ctrl"; To = "Medico"; Type = "Horizontal"; Dashed = $true }
    )

# ==============================================================================
# CU21: Generar reportes clínicos y estadísticos
# ==============================================================================
Generate-Diagram `
    -cuCode "CU21" `
    -title "Generación y exportación de reportes clínicos y estadísticos" `
    -actorName "Director Médico / Admin" `
    -uiClass @{
        Name = "UI_ReportesClinicos"
        X = 185; Y = 430; W = 225
        Attributes = @()
        Methods = @(
            "+ seleccionarTipoReporte(): void",
            "+ filtrarPorRangoFechas(): void",
            "+ filtrarPorEspecialidadYMedico(): void",
            "+ previsualizarMetricas(): void",
            "+ exportarCSVExcel(): void",
            "+ imprimirInformePDF(): void"
        )
    } `
    -ctrlClass @{
        Name = "CU21_ReportesController"
        X = 540; Y = 430; W = 250
        Attributes = @(
            "- parseRangoFechas(req): array"
        )
        Methods = @(
            "+ meta(): JsonResponse",
            "+ productividadMedica(Request): JsonResponse",
            "+ morbilidadCie10(Request): JsonResponse",
            "+ laboratoriosEstudios(Request): JsonResponse",
            "+ cancelacionesInasistencias(Request): JsonResponse",
            "+ auditarExportacion(Request): JsonResponse"
        )
    } `
    -entities @(
        @{
            Name = "Cita"
            X = 920; Y = 280; W = 240
            Attributes = @(
                "- id_cita: bigint",
                "- codigo_cita: string",
                "- fecha_cita: date",
                "- hora_inicio: time",
                "- estado_cita: string",
                "- id_medico: bigint",
                "- id_especialidad: bigint"
            )
            Methods = @(
                "+ count(): int",
                "+ whereBetween(): QueryBuilder",
                "+ groupBy(): QueryBuilder"
            )
        },
        @{
            Name = "AtencionMedica"
            X = 1200; Y = 280; W = 240
            Attributes = @(
                "- id_atencion: bigint",
                "- diagnostico_cie10: string",
                "- diagnostico_descripcion: text",
                "- signos_vitales: text",
                "- fecha_atencion: timestamp"
            )
            Methods = @(
                "+ count(): int",
                "+ groupBy(): QueryBuilder"
            )
        },
        @{
            Name = "LaboratorioEstudio"
            X = 920; Y = 590; W = 240
            Attributes = @(
                "- id_estudio: bigint",
                "- codigo_estudio: string",
                "- tipo_estudio: string",
                "- estado: string",
                "- resultado_diagnostico: text"
            )
            Methods = @(
                "+ count(): int",
                "+ whereBetween(): QueryBuilder"
            )
        },
        @{
            Name = "BitacoraAuditoria"
            X = 1200; Y = 590; W = 240
            Attributes = @(
                "- id_bitacora: bigint",
                "- modulo: string",
                "- operacion: string",
                "- valores_nuevos: jsonb",
                "- fecha_creacion: timestamp"
            )
            Methods = @(
                "+ create(data: array): Model"
            )
        }
    ) `
    -connections @(
        @{ From = "Ctrl"; To = "Cita"; Type = "Horizontal"; Dashed = $true },
        @{ From = "Ctrl"; To = "LaboratorioEstudio"; Type = "Horizontal"; Dashed = $true },
        @{ From = "Ctrl"; To = "AtencionMedica"; Type = "RightToTop"; Dashed = $true },
        @{ From = "Ctrl"; To = "BitacoraAuditoria"; Type = "Horizontal"; Dashed = $true }
    )

# ==============================================================================
# CU22: Copias de seguridad y restauración (Backup / Restore)
# ==============================================================================
Generate-Diagram `
    -cuCode "CU22" `
    -title "Gestión de copias de seguridad manuales y programación automática" `
    -actorName "Administrador del Sistema" `
    -uiClass @{
        Name = "UI_BackupRestore"
        X = 185; Y = 430; W = 225
        Attributes = @()
        Methods = @(
            "+ consultarHistorialBackups(): void",
            "+ solicitarGeneracionBackup(): void",
            "+ configurarProgramacionCron(): void",
            "+ ejecutarJobProgramado(): void",
            "+ descargarArchivoSQL(): void",
            "+ solicitarRestauracionBD(): void",
            "+ eliminarBackup(): void"
        )
    } `
    -ctrlClass @{
        Name = "CU22_BackupRestoreController"
        X = 540; Y = 430; W = 250
        Attributes = @(
            "- backupService: CU22_BackupService"
        )
        Methods = @(
            "+ index(Request): JsonResponse",
            "+ configuracion(): JsonResponse",
            "+ actualizarConfiguracion(Request): JsonResponse",
            "+ ejecutarProgramado(Request): JsonResponse",
            "+ generar(Request): JsonResponse",
            "+ descargar(id): BinaryFileResponse",
            "+ restaurar(Request, id): JsonResponse",
            "+ destroy(id): JsonResponse"
        )
    } `
    -entities @(
        @{
            Name = "BackupLog"
            X = 920; Y = 240; W = 240
            Attributes = @(
                "- id_backup: bigint",
                "- nombre_archivo: string",
                "- tipo_backup: string",
                "- tipo_disparo: string",
                "- tamano_bytes: bigint",
                "- estado: string",
                "- checksum_sha256: string",
                "- fecha_creacion: timestamp",
                "- fecha_restauracion: timestamp"
            )
            Methods = @(
                "+ create(data: array): Model",
                "+ findOrFail(id: int): Model",
                "+ update(data: array): bool"
            )
        },
        @{
            Name = "BackupConfiguracion"
            X = 1200; Y = 240; W = 240
            Attributes = @(
                "- id_configuracion: bigint",
                "- habilitado: boolean",
                "- frecuencia: string",
                "- hora_ejecucion: string",
                "- retencion_dias: int",
                "- limite_archivos: int",
                "- proximo_respaldo_at: timestamp"
            )
            Methods = @(
                "+ first(): Model",
                "+ calcularProximoRespaldo(): Carbon"
            )
        },
        @{
            Name = "BitacoraAuditoria"
            X = 920; Y = 590; W = 240
            Attributes = @(
                "- id_bitacora: bigint",
                "- modulo: string",
                "- tabla_afectada: string",
                "- operacion: string",
                "- valores_nuevos: jsonb",
                "- fecha_creacion: timestamp"
            )
            Methods = @(
                "+ create(data: array): Model"
            )
        },
        @{
            Name = "Usuario"
            X = 1200; Y = 590; W = 240
            Attributes = @(
                "- id_usuario: bigint",
                "- username: string",
                "- email: string",
                "- estado: string"
            )
            Methods = @(
                "+ find(id: int): Model"
            )
        }
    ) `
    -connections @(
        @{ From = "Ctrl"; To = "BackupLog"; Type = "Horizontal"; Dashed = $true },
        @{ From = "Ctrl"; To = "BackupConfiguracion"; Type = "RightToTop"; Dashed = $true },
        @{ From = "Ctrl"; To = "BitacoraAuditoria"; Type = "RightToBottom"; Dashed = $true },
        @{ From = "Ctrl"; To = "Usuario"; Type = "Horizontal"; Dashed = $true }
    )


