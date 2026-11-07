Add-Type -AssemblyName System.Drawing

$targetDir = $PSScriptRoot
if (-not $targetDir) { $targetDir = (Get-Location).Path }

function Draw-ActorIcon {
    param($g, $x, $y)
    $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(215, 100, 110), 1.5)
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 240, 240))
    # Head
    $g.FillEllipse($brush, ($x - 8), ($y - 28), 16, 16)
    $g.DrawEllipse($pen, ($x - 8), ($y - 28), 16, 16)
    # Body
    $g.DrawLine($pen, $x, ($y - 12), $x, ($y + 8))
    # Arms
    $g.DrawLine($pen, ($x - 14), ($y - 5), ($x + 14), ($y - 5))
    # Legs
    $g.DrawLine($pen, $x, ($y + 8), ($x - 10), ($y + 24))
    $g.DrawLine($pen, $x, ($y + 8), ($x + 10), ($y + 24))
}

function Draw-BoundaryIcon {
    param($g, $x, $y)
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(200, 235, 255))
    $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(85, 175, 220), 1.6)
    # Circle
    $g.FillEllipse($brush, ($x - 8), ($y - 12), 24, 24)
    $g.DrawEllipse($pen, ($x - 8), ($y - 12), 24, 24)
    # Vertical line to left
    $g.DrawLine($pen, ($x - 22), ($y - 14), ($x - 22), ($y + 14))
    # Horizontal connector
    $g.DrawLine($pen, ($x - 22), $y, ($x - 8), $y)
}

function Draw-ControlIcon {
    param($g, $x, $y)
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(200, 235, 255))
    $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(85, 175, 220), 1.6)
    # Circle
    $g.FillEllipse($brush, ($x - 12), ($y - 12), 24, 24)
    $g.DrawEllipse($pen, ($x - 12), ($y - 12), 24, 24)
    # Arrow on top
    $g.DrawLine($pen, ($x - 2), ($y - 16), ($x + 8), ($y - 12))
    $g.DrawLine($pen, ($x + 3), ($y - 19), ($x + 8), ($y - 12))
}

function Draw-EntityIcon {
    param($g, $x, $y)
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(200, 235, 255))
    $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(85, 175, 220), 1.6)
    # Circle
    $g.FillEllipse($brush, ($x - 12), ($y - 12), 24, 24)
    $g.DrawEllipse($pen, ($x - 12), ($y - 12), 24, 24)
    # Underline
    $g.DrawLine($pen, ($x - 16), ($y + 15), ($x + 16), ($y + 15))
    $g.DrawLine($pen, $x, ($y + 12), $x, ($y + 15))
}

function Draw-Arrow {
    param(
        $g,
        [int]$x1,
        [int]$x2,
        [int]$y,
        [string]$text,
        [bool]$isReturn,
        $font,
        $penSolid,
        $penDash,
        $textBrush
    )

    $pen = if ($isReturn) { $penDash } else { $penSolid }
    $g.DrawLine($pen, $x1, $y, $x2, $y)

    # Arrow head
    $arrowSize = 6
    if ($x2 -gt $x1) {
        # Right arrow
        if ($isReturn) {
            $g.DrawLine($penSolid, $x2, $y, ($x2 - $arrowSize), ($y - 4))
            $g.DrawLine($penSolid, $x2, $y, ($x2 - $arrowSize), ($y + 4))
        } else {
            $poly = @(
                [System.Drawing.Point]::new($x2, $y),
                [System.Drawing.Point]::new(($x2 - $arrowSize), ($y - 4)),
                [System.Drawing.Point]::new(($x2 - $arrowSize), ($y + 4))
            )
            $brush = New-Object System.Drawing.SolidBrush($penSolid.Color)
            $g.FillPolygon($brush, $poly)
        }
    } else {
        # Left arrow
        if ($isReturn) {
            $g.DrawLine($penSolid, $x2, $y, ($x2 + $arrowSize), ($y - 4))
            $g.DrawLine($penSolid, $x2, $y, ($x2 + $arrowSize), ($y + 4))
        } else {
            $poly = @(
                [System.Drawing.Point]::new($x2, $y),
                [System.Drawing.Point]::new(($x2 + $arrowSize), ($y - 4)),
                [System.Drawing.Point]::new(($x2 + $arrowSize), ($y + 4))
            )
            $brush = New-Object System.Drawing.SolidBrush($penSolid.Color)
            $g.FillPolygon($brush, $poly)
        }
    }

    # Label text above arrow
    $textX = [Math]::Min($x1, $x2) + 10
    $g.DrawString($text, $font, $textBrush, $textX, ($y - 16))
}

function Generate-SequenceDiagram {
    param(
        [string]$cuCode,
        [string]$title,
        [hashtable[]]$lifelines,
        [hashtable[]]$altSections
    )

    $width = 1750
    $height = 1100
    $bmp = New-Object System.Drawing.Bitmap $width, $height
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

    # 1. Background
    $g.Clear([System.Drawing.Color]::White)

    # Fonts
    $fontTitle = New-Object System.Drawing.Font("Arial", 9.5, [System.Drawing.FontStyle]::Bold)
    $fontLifeline = New-Object System.Drawing.Font("Arial", 9.0, [System.Drawing.FontStyle]::Regular)
    $fontAlt = New-Object System.Drawing.Font("Arial", 9.0, [System.Drawing.FontStyle]::Bold)
    $fontSection = New-Object System.Drawing.Font("Arial", 8.5, [System.Drawing.FontStyle]::Bold)
    $fontMsg = New-Object System.Drawing.Font("Segoe UI", 8.5, [System.Drawing.FontStyle]::Regular)

    # Brushes & Pens
    $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(20, 20, 20))
    $altBorderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(228, 168, 50), 1.5)
    $altDashPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(228, 168, 50), 1.2)
    $altDashPen.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dash
    $lifelinePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(140, 190, 230), 1.2)
    $lifelinePen.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dash
    $msgPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(40, 70, 110), 1.2)
    $msgDashPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(60, 100, 150), 1.2)
    $msgDashPen.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dash
    $actBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(254, 252, 215)) # Pale yellow activation
    $actPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(160, 140, 60), 1.0)
    $altBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(240, 175, 55))

    # Frame tag
    $tagText = "sd ${cuCode}: $title"
    $g.DrawString($tagText, $fontTitle, $textBrush, 35, 18)

    # Watermark (Enterprise Architect style)
    $wmFont = New-Object System.Drawing.Font("Arial", 8.5, [System.Drawing.FontStyle]::Regular)
    $wmBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(12, 0, 0, 0))
    for ($wy = 70; $wy -lt ($height - 40); $wy += 45) {
        for ($wx = 40; $wx -lt ($width - 150); $wx += 280) {
            $g.DrawString("EA 17.2 Unregistered Trial Version", $wmFont, $wmBrush, $wx, $wy)
        }
    }

    # 2. Draw Lifelines Header
    $headerY = 55
    $lineStartY = 105
    $lineEndY = $height - 40

    $lifelinePositions = @{}
    foreach ($ll in $lifelines) {
        $x = $ll.X
        $lifelinePositions[$ll.Id] = $x

        # Draw Icon
        if ($ll.Type -eq "Actor") {
            Draw-ActorIcon $g $x ($headerY + 8)
        } elseif ($ll.Type -eq "Boundary") {
            Draw-BoundaryIcon $g $x ($headerY + 12)
        } elseif ($ll.Type -eq "Control") {
            Draw-ControlIcon $g $x ($headerY + 12)
        } elseif ($ll.Type -eq "Entity") {
            Draw-EntityIcon $g $x ($headerY + 12)
        }

        # Label
        $sf = New-Object System.Drawing.StringFormat
        $sf.Alignment = [System.Drawing.StringAlignment]::Center
        $rect = [System.Drawing.RectangleF]::new(($x - 80), ($headerY + 30), 160, 20)
        $g.DrawString($ll.Name, $fontLifeline, $textBrush, $rect, $sf)

        # Vertical dashed lifeline
        $g.DrawLine($lifelinePen, $x, $lineStartY, $x, $lineEndY)
    }

    # 3. Draw Combined Fragment 'alt'
    $altTop = 115
    $altBottom = $height - 50
    $altLeft = 40
    $altRight = $width - 40

    $g.DrawRectangle($altBorderPen, $altLeft, $altTop, ($altRight - $altLeft), ($altBottom - $altTop))

    # 'alt' tab
    $altPoly = @(
        [System.Drawing.Point]::new($altLeft, $altTop),
        [System.Drawing.Point]::new(($altLeft + 55), $altTop),
        [System.Drawing.Point]::new(($altLeft + 65), ($altTop + 14)),
        [System.Drawing.Point]::new(($altLeft + 55), ($altTop + 20)),
        [System.Drawing.Point]::new($altLeft, ($altTop + 20))
    )
    $g.DrawLines($altBorderPen, $altPoly)
    $g.DrawString("alt", $fontAlt, $textBrush, ($altLeft + 12), ($altTop + 3))

    # 4. Render alt sections & messages
    $currentY = 145
    for ($sIdx = 0; $sIdx -lt $altSections.Length; $sIdx++) {
        $sec = $altSections[$sIdx]

        # Section condition header
        $g.DrawString($sec.Condition, $fontSection, $textBrush, ($altLeft + 75), ($currentY - 18))

        # Divider if not first section
        if ($sIdx -gt 0) {
            $divY = $currentY - 28
            $g.DrawLine($altDashPen, $altLeft, $divY, $altRight, $divY)
        }

        # Activations for this section
        foreach ($act in $sec.Activations) {
            $ax = $lifelinePositions[$act.Id] - 6
            $ay = $act.StartY
            $ah = $act.Height
            $g.FillRectangle($actBrush, $ax, $ay, 12, $ah)
            $g.DrawRectangle($actPen, $ax, $ay, 12, $ah)
        }

        # Messages
        foreach ($msg in $sec.Messages) {
            $x1 = $lifelinePositions[$msg.From]
            $x2 = $lifelinePositions[$msg.To]
            $y = $msg.Y
            Draw-Arrow $g $x1 $x2 $y $msg.Text $msg.IsReturn $fontMsg $msgPen $msgDashPen $textBrush
        }

        $currentY = $sec.NextSectionY
    }

    # 5. Save images
    $fileName = "Diagrama_Secuencia_Analisis_$cuCode.png"
    $savePath = Join-Path $targetDir $fileName
    $bmp.Save($savePath, [System.Drawing.Imaging.ImageFormat]::Png)

    $g.Dispose()
    $bmp.Dispose()
    Write-Output "Successfully generated: $fileName"
}

# ==============================================================================
# CU13: Control de asistencia a citas médicas
# ==============================================================================
Generate-SequenceDiagram `
    -cuCode "CU13" `
    -title "Control de asistencia y llegadas a citas médicas" `
    -lifelines @(
        @{ Id = "Actor"; Name = "Recepcionista"; Type = "Actor"; X = 85 },
        @{ Id = "UI"; Name = "UI_ControlAsistencia"; Type = "Boundary"; X = 320 },
        @{ Id = "Ctrl"; Name = "AsistenciaController"; Type = "Control"; X = 650 },
        @{ Id = "Cita"; Name = "Cita"; Type = "Entity"; X = 1000 },
        @{ Id = "Aud"; Name = "BitacoraAuditoria"; Type = "Entity"; X = 1350 }
    ) `
    -altSections @(
        @{
            Condition = "[Marcar asistencia del paciente (En sala de espera)]"
            NextSectionY = 570
            Activations = @(
                @{ Id = "Actor"; StartY = 160; Height = 340 },
                @{ Id = "UI"; StartY = 170; Height = 310 },
                @{ Id = "Ctrl"; StartY = 195; Height = 260 },
                @{ Id = "Cita"; StartY = 225; Height = 65 },
                @{ Id = "Aud"; StartY = 330; Height = 65 }
            )
            Messages = @(
                @{ From = "Actor"; To = "UI"; Y = 175; Text = "1. MarcarAsistencia(idCita, ""EN_SALA"")"; IsReturn = $false },
                @{ From = "UI"; To = "Ctrl"; Y = 205; Text = "1.1. RegistrarAsistencia(idCita, Request)"; IsReturn = $false },
                @{ From = "Ctrl"; To = "Cita"; Y = 235; Text = "1.2. FindOrFail(idCita)->Update([""estado_cita"" => ""EN_SALA""])"; IsReturn = $false },
                @{ From = "Cita"; To = "Ctrl"; Y = 285; Text = "RespuestaActualizacion()"; IsReturn = $true },
                @{ From = "Ctrl"; To = "Aud"; Y = 340; Text = "1.3. Registrar(""UPDATE"", ""citas"", idCita)"; IsReturn = $false },
                @{ From = "Aud"; To = "Ctrl"; Y = 390; Text = "RespuestaBitacora()"; IsReturn = $true },
                @{ From = "Ctrl"; To = "UI"; Y = 445; Text = "RespuestaAsistencia(estadoActualizado)"; IsReturn = $true },
                @{ From = "UI"; To = "Actor"; Y = 475; Text = "Confirmación(""Paciente registrado en sala"")"; IsReturn = $true }
            )
        },
        @{
            Condition = "[Marcar inasistencia del paciente (No Show)]"
            NextSectionY = 1000
            Activations = @(
                @{ Id = "Actor"; StartY = 600; Height = 340 },
                @{ Id = "UI"; StartY = 610; Height = 310 },
                @{ Id = "Ctrl"; StartY = 635; Height = 260 },
                @{ Id = "Cita"; StartY = 665; Height = 65 },
                @{ Id = "Aud"; StartY = 770; Height = 65 }
            )
            Messages = @(
                @{ From = "Actor"; To = "UI"; Y = 615; Text = "2. MarcarInasistencia(idCita, ""NO_ASISTIO"")"; IsReturn = $false },
                @{ From = "UI"; To = "Ctrl"; Y = 645; Text = "2.1. RegistrarInasistencia(idCita, Request)"; IsReturn = $false },
                @{ From = "Ctrl"; To = "Cita"; Y = 675; Text = "2.2. FindOrFail(idCita)->Update([""estado_cita"" => ""NO_ASISTIO""])"; IsReturn = $false },
                @{ From = "Cita"; To = "Ctrl"; Y = 725; Text = "RespuestaActualizacion()"; IsReturn = $true },
                @{ From = "Ctrl"; To = "Aud"; Y = 780; Text = "2.3. Registrar(""UPDATE"", ""citas"", idCita)"; IsReturn = $false },
                @{ From = "Aud"; To = "Ctrl"; Y = 830; Text = "RespuestaBitacora()"; IsReturn = $true },
                @{ From = "Ctrl"; To = "UI"; Y = 885; Text = "RespuestaInasistencia()"; IsReturn = $true },
                @{ From = "UI"; To = "Actor"; Y = 915; Text = "Confirmación(""Inasistencia registrada"")"; IsReturn = $true }
            )
        }
    )

# ==============================================================================
# CU14: Registrar y actualizar antecedentes clínicos base
# ==============================================================================
Generate-SequenceDiagram `
    -cuCode "CU14" `
    -title "Registrar y actualizar antecedentes clínicos base" `
    -lifelines @(
        @{ Id = "Actor"; Name = "Médico / Recepcionista"; Type = "Actor"; X = 85 },
        @{ Id = "UI"; Name = "UI_AntecedentesClinicos"; Type = "Boundary"; X = 300 },
        @{ Id = "Ctrl"; Name = "AntecedentesClinicosController"; Type = "Control"; X = 590 },
        @{ Id = "HC"; Name = "HistoriaClinica"; Type = "Entity"; X = 880 },
        @{ Id = "CE"; Name = "ContactoEmergencia"; Type = "Entity"; X = 1170 },
        @{ Id = "Aud"; Name = "BitacoraAuditoria"; Type = "Entity"; X = 1460 }
    ) `
    -altSections @(
        @{
            Condition = "[Consultar expediente y antecedentes del paciente]"
            NextSectionY = 530
            Activations = @(
                @{ Id = "Actor"; StartY = 160; Height = 310 },
                @{ Id = "UI"; StartY = 170; Height = 285 },
                @{ Id = "Ctrl"; StartY = 195; Height = 235 },
                @{ Id = "HC"; StartY = 220; Height = 60 },
                @{ Id = "CE"; StartY = 315; Height = 60 }
            )
            Messages = @(
                @{ From = "Actor"; To = "UI"; Y = 175; Text = "1. ConsultarAntecedentes(idPaciente)"; IsReturn = $false },
                @{ From = "UI"; To = "Ctrl"; Y = 200; Text = "1.1. Show(idPaciente)"; IsReturn = $false },
                @{ From = "Ctrl"; To = "HC"; Y = 225; Text = "1.2. Where(""id_paciente"", idPaciente)->First()"; IsReturn = $false },
                @{ From = "HC"; To = "Ctrl"; Y = 275; Text = "RespuestaHistoriaClinica(antecedentes, alergias)"; IsReturn = $true },
                @{ From = "Ctrl"; To = "CE"; Y = 320; Text = "1.3. Where(""id_paciente"", idPaciente)->First()"; IsReturn = $false },
                @{ From = "CE"; To = "Ctrl"; Y = 370; Text = "RespuestaContacto(contactoEmergencia)"; IsReturn = $true },
                @{ From = "Ctrl"; To = "UI"; Y = 415; Text = "RespuestaFichaClinica(expedienteCompleto)"; IsReturn = $true },
                @{ From = "UI"; To = "Actor"; Y = 445; Text = "VisualizarFichaClinica()"; IsReturn = $true }
            )
        },
        @{
            Condition = "[Registrar / Actualizar antecedentes clínicos y alerta alérgica]"
            NextSectionY = 1020
            Activations = @(
                @{ Id = "Actor"; StartY = 560; Height = 390 },
                @{ Id = "UI"; StartY = 570; Height = 365 },
                @{ Id = "Ctrl"; StartY = 595; Height = 315 },
                @{ Id = "HC"; StartY = 620; Height = 65 },
                @{ Id = "CE"; StartY = 715; Height = 65 },
                @{ Id = "Aud"; StartY = 810; Height = 65 }
            )
            Messages = @(
                @{ From = "Actor"; To = "UI"; Y = 575; Text = "2. GuardarAntecedentes(datosClinicos, contacto)"; IsReturn = $false },
                @{ From = "UI"; To = "Ctrl"; Y = 600; Text = "2.1. Update(Request, idPaciente)"; IsReturn = $false },
                @{ From = "Ctrl"; To = "HC"; Y = 625; Text = "2.2. FirstOrNew()->Save(alergias, tipoSangre, patologias)"; IsReturn = $false },
                @{ From = "HC"; To = "Ctrl"; Y = 680; Text = "RespuestaGuardadoHistoria()"; IsReturn = $true },
                @{ From = "Ctrl"; To = "CE"; Y = 720; Text = "2.3. UpdateOrCreate(datosContactoEmergencia)"; IsReturn = $false },
                @{ From = "CE"; To = "Ctrl"; Y = 775; Text = "RespuestaContacto()"; IsReturn = $true },
                @{ From = "Ctrl"; To = "Aud"; Y = 815; Text = "2.4. Registrar(""UPDATE"", ""historias_clinicas"", idHistoria)"; IsReturn = $false },
                @{ From = "Aud"; To = "Ctrl"; Y = 870; Text = "RespuestaBitacora()"; IsReturn = $true },
                @{ From = "Ctrl"; To = "UI"; Y = 905; Text = "RespuestaActualizacionExitosa()"; IsReturn = $true },
                @{ From = "UI"; To = "Actor"; Y = 935; Text = "Confirmación(""Antecedentes actualizados"")"; IsReturn = $true }
            )
        }
    )

# ==============================================================================
# CU15: Visualizar agenda médica diaria
# ==============================================================================
Generate-SequenceDiagram `
    -cuCode "CU15" `
    -title "Visualizar agenda médica diaria y llamar paciente" `
    -lifelines @(
        @{ Id = "Actor"; Name = "Médico"; Type = "Actor"; X = 85 },
        @{ Id = "UI"; Name = "UI_AgendaDiariaMedico"; Type = "Boundary"; X = 320 },
        @{ Id = "Ctrl"; Name = "AgendaMedicoController"; Type = "Control"; X = 650 },
        @{ Id = "Med"; Name = "Medico"; Type = "Entity"; X = 980 },
        @{ Id = "Cita"; Name = "Cita"; Type = "Entity"; X = 1250 },
        @{ Id = "HC"; Name = "HistoriaClinica"; Type = "Entity"; X = 1520 }
    ) `
    -altSections @(
        @{
            Condition = "[Cargar agenda del día del médico autenticado]"
            NextSectionY = 530
            Activations = @(
                @{ Id = "Actor"; StartY = 160; Height = 310 },
                @{ Id = "UI"; StartY = 170; Height = 285 },
                @{ Id = "Ctrl"; StartY = 195; Height = 235 },
                @{ Id = "Med"; StartY = 220; Height = 55 },
                @{ Id = "Cita"; StartY = 305; Height = 65 }
            )
            Messages = @(
                @{ From = "Actor"; To = "UI"; Y = 175; Text = "1. AbrirAgendaDiaria(fechaHoy)"; IsReturn = $false },
                @{ From = "UI"; To = "Ctrl"; Y = 200; Text = "1.1. AgendaDiaria(Request)"; IsReturn = $false },
                @{ From = "Ctrl"; To = "Med"; Y = 225; Text = "1.2. Where(""id_usuario"", authId)->FirstOrFail()"; IsReturn = $false },
                @{ From = "Med"; To = "Ctrl"; Y = 270; Text = "RespuestaMedico(idMedico)"; IsReturn = $true },
                @{ From = "Ctrl"; To = "Cita"; Y = 310; Text = "1.3. WhereDate(""fecha_cita"", hoy)->With(""paciente"")"; IsReturn = $false },
                @{ From = "Cita"; To = "Ctrl"; Y = 365; Text = "RespuestaCitas(listaCitasDia)"; IsReturn = $true },
                @{ From = "Ctrl"; To = "UI"; Y = 415; Text = "RespuestaAgenda(citas, estadisticas)"; IsReturn = $true },
                @{ From = "UI"; To = "Actor"; Y = 445; Text = "MostrarAgendaDiaria()"; IsReturn = $true }
            )
        },
        @{
            Condition = "[Llamar paciente y visualizar expediente clínico previo]"
            NextSectionY = 1000
            Activations = @(
                @{ Id = "Actor"; StartY = 560; Height = 370 },
                @{ Id = "UI"; StartY = 570; Height = 345 },
                @{ Id = "Ctrl"; StartY = 595; Height = 295 },
                @{ Id = "Cita"; StartY = 620; Height = 60 },
                @{ Id = "HC"; StartY = 710; Height = 60 }
            )
            Messages = @(
                @{ From = "Actor"; To = "UI"; Y = 575; Text = "2. LlamarPacienteYVerExpediente(idCita)"; IsReturn = $false },
                @{ From = "UI"; To = "Ctrl"; Y = 600; Text = "2.1. ExpedientePaciente(idCita)"; IsReturn = $false },
                @{ From = "Ctrl"; To = "Cita"; Y = 625; Text = "2.2. FindOrFail(idCita)->With(""paciente"")"; IsReturn = $false },
                @{ From = "Cita"; To = "Ctrl"; Y = 675; Text = "RespuestaCitaPaciente(datos)"; IsReturn = $true },
                @{ From = "Ctrl"; To = "HC"; Y = 715; Text = "2.3. Where(""id_paciente"", idPaciente)->First()"; IsReturn = $false },
                @{ From = "HC"; To = "Ctrl"; Y = 765; Text = "RespuestaHistoria(alergias, antecedentes)"; IsReturn = $true },
                @{ From = "Ctrl"; To = "UI"; Y = 825; Text = "RespuestaExpediente()"; IsReturn = $true },
                @{ From = "UI"; To = "Actor"; Y = 855; Text = "MostrarFichaYEstadoPaciente()"; IsReturn = $true }
            )
        }
    )

# ==============================================================================
# CU16: Atender consulta y registrar evolución clínica
# ==============================================================================
Generate-SequenceDiagram `
    -cuCode "CU16" `
    -title "Atender consulta y registrar evolución clínica" `
    -lifelines @(
        @{ Id = "Actor"; Name = "Médico"; Type = "Actor"; X = 85 },
        @{ Id = "UI"; Name = "UI_AtenderConsulta"; Type = "Boundary"; X = 320 },
        @{ Id = "Ctrl"; Name = "AtencionMedicaController"; Type = "Control"; X = 650 },
        @{ Id = "Cita"; Name = "Cita"; Type = "Entity"; X = 980 },
        @{ Id = "Atn"; Name = "AtencionMedica"; Type = "Entity"; X = 1260 },
        @{ Id = "Aud"; Name = "BitacoraAuditoria"; Type = "Entity"; X = 1530 }
    ) `
    -altSections @(
        @{
            Condition = "[Iniciar atención médica de la cita]"
            NextSectionY = 530
            Activations = @(
                @{ Id = "Actor"; StartY = 160; Height = 310 },
                @{ Id = "UI"; StartY = 170; Height = 285 },
                @{ Id = "Ctrl"; StartY = 195; Height = 235 },
                @{ Id = "Cita"; StartY = 220; Height = 65 }
            )
            Messages = @(
                @{ From = "Actor"; To = "UI"; Y = 175; Text = "1. IniciarAtencion(idCita)"; IsReturn = $false },
                @{ From = "UI"; To = "Ctrl"; Y = 200; Text = "1.1. IniciarConsulta(idCita)"; IsReturn = $false },
                @{ From = "Ctrl"; To = "Cita"; Y = 225; Text = "1.2. FindOrFail(idCita)->Update([""estado_cita"" => ""EN_ATENCION""])"; IsReturn = $false },
                @{ From = "Cita"; To = "Ctrl"; Y = 280; Text = "RespuestaCitaActualizada()"; IsReturn = $true },
                @{ From = "Ctrl"; To = "UI"; Y = 360; Text = "RespuestaConsultaIniciada(datosPaciente)"; IsReturn = $true },
                @{ From = "UI"; To = "Actor"; Y = 400; Text = "HabilitarFormularioEvolucion()"; IsReturn = $true }
            )
        },
        @{
            Condition = "[Registrar diagnóstico CIE-10, receta y cerrar atención]"
            NextSectionY = 1040
            Activations = @(
                @{ Id = "Actor"; StartY = 560; Height = 410 },
                @{ Id = "UI"; StartY = 570; Height = 385 },
                @{ Id = "Ctrl"; StartY = 595; Height = 335 },
                @{ Id = "Atn"; StartY = 620; Height = 65 },
                @{ Id = "Cita"; StartY = 715; Height = 65 },
                @{ Id = "Aud"; StartY = 810; Height = 65 }
            )
            Messages = @(
                @{ From = "Actor"; To = "UI"; Y = 575; Text = "2. FinalizarConsulta(cie10, sintomas, tratamiento, receta)"; IsReturn = $false },
                @{ From = "UI"; To = "Ctrl"; Y = 600; Text = "2.1. GuardarAtencion(idCita, Request)"; IsReturn = $false },
                @{ From = "Ctrl"; To = "Atn"; Y = 625; Text = "2.2. Create(idCita, idHistoria, cie10, sintomas, receta)"; IsReturn = $false },
                @{ From = "Atn"; To = "Ctrl"; Y = 680; Text = "RespuestaAtencion(idAtencion)"; IsReturn = $true },
                @{ From = "Ctrl"; To = "Cita"; Y = 720; Text = "2.3. Update([""estado_cita"" => ""COMPLETADA""])"; IsReturn = $false },
                @{ From = "Cita"; To = "Ctrl"; Y = 775; Text = "RespuestaCitaCerrada()"; IsReturn = $true },
                @{ From = "Ctrl"; To = "Aud"; Y = 815; Text = "2.4. Registrar(""INSERT"", ""atenciones_medicas"", idAtencion)"; IsReturn = $false },
                @{ From = "Aud"; To = "Ctrl"; Y = 870; Text = "RespuestaBitacora()"; IsReturn = $true },
                @{ From = "Ctrl"; To = "UI"; Y = 910; Text = "RespuestaFinalizacion()"; IsReturn = $true },
                @{ From = "UI"; To = "Actor"; Y = 940; Text = "Confirmación(""Consulta registrada y finalizada"")"; IsReturn = $true }
            )
        }
    )

# ==============================================================================
# CU17: Cargar estudios y resultados de laboratorio
# ==============================================================================
Generate-SequenceDiagram `
    -cuCode "CU17" `
    -title "Cargar estudios y resultados de laboratorio" `
    -lifelines @(
        @{ Id = "Actor"; Name = "Laboratorista / Recepcionista"; Type = "Actor"; X = 85 },
        @{ Id = "UI"; Name = "UI_CargaEstudios"; Type = "Boundary"; X = 320 },
        @{ Id = "Ctrl"; Name = "CargaEstudioController"; Type = "Control"; X = 650 },
        @{ Id = "Pac"; Name = "Paciente"; Type = "Entity"; X = 980 },
        @{ Id = "Lab"; Name = "LaboratorioEstudio"; Type = "Entity"; X = 1260 },
        @{ Id = "Aud"; Name = "BitacoraAuditoria"; Type = "Entity"; X = 1530 }
    ) `
    -altSections @(
        @{
            Condition = "[Registrar nueva solicitud de estudio para paciente]"
            NextSectionY = 540
            Activations = @(
                @{ Id = "Actor"; StartY = 160; Height = 320 },
                @{ Id = "UI"; StartY = 170; Height = 295 },
                @{ Id = "Ctrl"; StartY = 195; Height = 245 },
                @{ Id = "Pac"; StartY = 220; Height = 55 },
                @{ Id = "Lab"; StartY = 305; Height = 65 }
            )
            Messages = @(
                @{ From = "Actor"; To = "UI"; Y = 175; Text = "1. RegistrarSolicitud(ciPaciente, nombreEstudio, tipo)"; IsReturn = $false },
                @{ From = "UI"; To = "Ctrl"; Y = 200; Text = "1.1. Store(Request)"; IsReturn = $false },
                @{ From = "Ctrl"; To = "Pac"; Y = 225; Text = "1.2. Where(""ci"", ciPaciente)->FirstOrFail()"; IsReturn = $false },
                @{ From = "Pac"; To = "Ctrl"; Y = 270; Text = "RespuestaPaciente(idPaciente)"; IsReturn = $true },
                @{ From = "Ctrl"; To = "Lab"; Y = 310; Text = "1.3. Create(codigo, idPaciente, nombreEstudio, ""PENDIENTE"")"; IsReturn = $false },
                @{ From = "Lab"; To = "Ctrl"; Y = 365; Text = "RespuestaEstudio(idEstudio)"; IsReturn = $true },
                @{ From = "Ctrl"; To = "UI"; Y = 420; Text = "RespuestaCreacion()"; IsReturn = $true },
                @{ From = "UI"; To = "Actor"; Y = 450; Text = "Confirmación(""Estudio registrado con éxito"")"; IsReturn = $true }
            )
        },
        @{
            Condition = "[Cargar resultado diagnóstico y publicar PDF]"
            NextSectionY = 1010
            Activations = @(
                @{ Id = "Actor"; StartY = 570; Height = 380 },
                @{ Id = "UI"; StartY = 580; Height = 355 },
                @{ Id = "Ctrl"; StartY = 605; Height = 305 },
                @{ Id = "Lab"; StartY = 630; Height = 65 },
                @{ Id = "Aud"; StartY = 725; Height = 65 }
            )
            Messages = @(
                @{ From = "Actor"; To = "UI"; Y = 585; Text = "2. GuardarResultado(idEstudio, diagnostico, archivoPdf)"; IsReturn = $false },
                @{ From = "UI"; To = "Ctrl"; Y = 610; Text = "2.1. GuardarResultado(idEstudio, Request)"; IsReturn = $false },
                @{ From = "Ctrl"; To = "Lab"; Y = 635; Text = "2.2. FindOrFail(idEstudio)->Update(diagnostico, url, ""COMPLETADO"")"; IsReturn = $false },
                @{ From = "Lab"; To = "Ctrl"; Y = 690; Text = "RespuestaResultadoGuardado()"; IsReturn = $true },
                @{ From = "Ctrl"; To = "Aud"; Y = 730; Text = "2.3. Registrar(""UPDATE"", ""laboratorios_estudios"", idEstudio)"; IsReturn = $false },
                @{ From = "Aud"; To = "Ctrl"; Y = 785; Text = "RespuestaBitacora()"; IsReturn = $true },
                @{ From = "Ctrl"; To = "UI"; Y = 855; Text = "RespuestaPublicacion()"; IsReturn = $true },
                @{ From = "UI"; To = "Actor"; Y = 885; Text = "Confirmación(""Resultado publicado correctamente"")"; IsReturn = $true }
            )
        }
    )

# ==============================================================================
# CU18: Visualizar y descargar estudios de laboratorio
# ==============================================================================
Generate-SequenceDiagram `
    -cuCode "CU18" `
    -title "Visualizar y descargar estudios de laboratorio" `
    -lifelines @(
        @{ Id = "Actor"; Name = "Paciente / Médico"; Type = "Actor"; X = 85 },
        @{ Id = "UI"; Name = "UI_VisualizarEstudios"; Type = "Boundary"; X = 350 },
        @{ Id = "Ctrl"; Name = "VisualizarEstudiosController"; Type = "Control"; X = 720 },
        @{ Id = "Lab"; Name = "LaboratorioEstudio"; Type = "Entity"; X = 1150 },
        @{ Id = "Pac"; Name = "Paciente"; Type = "Entity"; X = 1480 }
    ) `
    -altSections @(
        @{
            Condition = "[Consultar historial de estudios completados]"
            NextSectionY = 520
            Activations = @(
                @{ Id = "Actor"; StartY = 160; Height = 300 },
                @{ Id = "UI"; StartY = 170; Height = 275 },
                @{ Id = "Ctrl"; StartY = 195; Height = 225 },
                @{ Id = "Lab"; StartY = 220; Height = 65 }
            )
            Messages = @(
                @{ From = "Actor"; To = "UI"; Y = 175; Text = "1. ConsultarEstudios(filtros)"; IsReturn = $false },
                @{ From = "UI"; To = "Ctrl"; Y = 200; Text = "1.1. Index(Request)"; IsReturn = $false },
                @{ From = "Ctrl"; To = "Lab"; Y = 225; Text = "1.2. Where(""estado"", ""COMPLETADO"")->With(""paciente"")"; IsReturn = $false },
                @{ From = "Lab"; To = "Ctrl"; Y = 280; Text = "RespuestaListaEstudios()"; IsReturn = $true },
                @{ From = "Ctrl"; To = "UI"; Y = 360; Text = "RespuestaEstudios(listaEstudios)"; IsReturn = $true },
                @{ From = "UI"; To = "Actor"; Y = 400; Text = "MostrarTablaEstudios()"; IsReturn = $true }
            )
        },
        @{
            Condition = "[Previsualizar detalle y descargar informe PDF]"
            NextSectionY = 960
            Activations = @(
                @{ Id = "Actor"; StartY = 550; Height = 350 },
                @{ Id = "UI"; StartY = 560; Height = 325 },
                @{ Id = "Ctrl"; StartY = 585; Height = 275 },
                @{ Id = "Lab"; StartY = 610; Height = 65 }
            )
            Messages = @(
                @{ From = "Actor"; To = "UI"; Y = 565; Text = "2. VerDetalleYDescargar(idEstudio)"; IsReturn = $false },
                @{ From = "UI"; To = "Ctrl"; Y = 590; Text = "2.1. Show(idEstudio)"; IsReturn = $false },
                @{ From = "Ctrl"; To = "Lab"; Y = 615; Text = "2.2. FindOrFail(idEstudio)->With(""paciente"")"; IsReturn = $false },
                @{ From = "Lab"; To = "Ctrl"; Y = 670; Text = "RespuestaDetalle(resultado, archivoPdfUrl)"; IsReturn = $true },
                @{ From = "Ctrl"; To = "UI"; Y = 755; Text = "RespuestaDetalleYUrlPdf()"; IsReturn = $true },
                @{ From = "UI"; To = "Actor"; Y = 795; Text = "AbrirVisorInformePDF()"; IsReturn = $true }
            )
        }
    )

# ==============================================================================
# CU19: Gestionar recordatorios y notificaciones de citas
# ==============================================================================
Generate-SequenceDiagram `
    -cuCode "CU19" `
    -title "Gestionar recordatorios y notificaciones de citas" `
    -lifelines @(
        @{ Id = "Actor"; Name = "Administrador / Sistema"; Type = "Actor"; X = 85 },
        @{ Id = "UI"; Name = "UI_GestionRecordatorios"; Type = "Boundary"; X = 320 },
        @{ Id = "Ctrl"; Name = "RecordatorioController"; Type = "Control"; X = 650 },
        @{ Id = "Cita"; Name = "Cita"; Type = "Entity"; X = 980 },
        @{ Id = "Rec"; Name = "Recordatorio"; Type = "Entity"; X = 1260 },
        @{ Id = "Aud"; Name = "BitacoraAuditoria"; Type = "Entity"; X = 1530 }
    ) `
    -altSections @(
        @{
            Condition = "[Escaneo y programación automática de recordatorios 24h]"
            NextSectionY = 540
            Activations = @(
                @{ Id = "Actor"; StartY = 160; Height = 320 },
                @{ Id = "UI"; StartY = 170; Height = 295 },
                @{ Id = "Ctrl"; StartY = 195; Height = 245 },
                @{ Id = "Cita"; StartY = 220; Height = 55 },
                @{ Id = "Rec"; StartY = 305; Height = 65 }
            )
            Messages = @(
                @{ From = "Actor"; To = "UI"; Y = 175; Text = "1. EjecutarEscaneo24h()"; IsReturn = $false },
                @{ From = "UI"; To = "Ctrl"; Y = 200; Text = "1.1. EscanearProximas24Horas()"; IsReturn = $false },
                @{ From = "Ctrl"; To = "Cita"; Y = 225; Text = "1.2. WhereBetween(""fecha_cita"", rango24h)->Where(""estado"", ""PROGRAMADA"")"; IsReturn = $false },
                @{ From = "Cita"; To = "Ctrl"; Y = 270; Text = "RespuestaCitasProximas(citas)"; IsReturn = $true },
                @{ From = "Ctrl"; To = "Rec"; Y = 310; Text = "1.3. Create([""id_cita"" => idCita, ""canal"" => ""WHATSAPP"", ""estado"" => ""PENDIENTE""])"; IsReturn = $false },
                @{ From = "Rec"; To = "Ctrl"; Y = 365; Text = "RespuestaRecordatoriosCreados()"; IsReturn = $true },
                @{ From = "Ctrl"; To = "UI"; Y = 420; Text = "RespuestaEscaneo(totalProgramados)"; IsReturn = $true },
                @{ From = "UI"; To = "Actor"; Y = 450; Text = "Confirmación(""Recordatorios programados"")"; IsReturn = $true }
            )
        },
        @{
            Condition = "[Reenviar recordatorio manual o reintentar fallido]"
            NextSectionY = 1010
            Activations = @(
                @{ Id = "Actor"; StartY = 570; Height = 380 },
                @{ Id = "UI"; StartY = 580; Height = 355 },
                @{ Id = "Ctrl"; StartY = 605; Height = 305 },
                @{ Id = "Rec"; StartY = 630; Height = 65 },
                @{ Id = "Aud"; StartY = 725; Height = 65 }
            )
            Messages = @(
                @{ From = "Actor"; To = "UI"; Y = 585; Text = "2. ReenviarRecordatorio(idRecordatorio)"; IsReturn = $false },
                @{ From = "UI"; To = "Ctrl"; Y = 610; Text = "2.1. Reenviar(idRecordatorio)"; IsReturn = $false },
                @{ From = "Ctrl"; To = "Rec"; Y = 635; Text = "2.2. FindOrFail(idRecordatorio)->Increment(""intentos"")->Update(""ENVIADO"")"; IsReturn = $false },
                @{ From = "Rec"; To = "Ctrl"; Y = 690; Text = "RespuestaEnvioExitosa()"; IsReturn = $true },
                @{ From = "Ctrl"; To = "Aud"; Y = 730; Text = "2.3. Registrar(""UPDATE"", ""recordatorios"", idRecordatorio)"; IsReturn = $false },
                @{ From = "Aud"; To = "Ctrl"; Y = 785; Text = "RespuestaBitacora()"; IsReturn = $true },
                @{ From = "Ctrl"; To = "UI"; Y = 855; Text = "RespuestaReenvio()"; IsReturn = $true },
                @{ From = "UI"; To = "Actor"; Y = 885; Text = "Confirmación(""Recordatorio reenviado"")"; IsReturn = $true }
            )
        }
    )

# ==============================================================================
# CU20: Dashboard operativo y métricas clínicas
# ==============================================================================
Generate-SequenceDiagram `
    -cuCode "CU20" `
    -title "Dashboard operativo y métricas clínicas" `
    -lifelines @(
        @{ Id = "Actor"; Name = "Director Médico / Admin"; Type = "Actor"; X = 85 },
        @{ Id = "UI"; Name = "UI_DashboardMetricas"; Type = "Boundary"; X = 320 },
        @{ Id = "Ctrl"; Name = "DashboardController"; Type = "Control"; X = 650 },
        @{ Id = "Cita"; Name = "Cita"; Type = "Entity"; X = 980 },
        @{ Id = "Pac"; Name = "Paciente"; Type = "Entity"; X = 1260 },
        @{ Id = "Atn"; Name = "AtencionMedica"; Type = "Entity"; X = 1530 }
    ) `
    -altSections @(
        @{
            Condition = "[Cargar métricas generales y KPIs de hoy]"
            NextSectionY = 560
            Activations = @(
                @{ Id = "Actor"; StartY = 160; Height = 340 },
                @{ Id = "UI"; StartY = 170; Height = 315 },
                @{ Id = "Ctrl"; StartY = 195; Height = 265 },
                @{ Id = "Cita"; StartY = 220; Height = 55 },
                @{ Id = "Pac"; StartY = 300; Height = 55 },
                @{ Id = "Atn"; StartY = 380; Height = 55 }
            )
            Messages = @(
                @{ From = "Actor"; To = "UI"; Y = 175; Text = "1. SolicitarMetricasHoy()"; IsReturn = $false },
                @{ From = "UI"; To = "Ctrl"; Y = 200; Text = "1.1. Metricas(Request)"; IsReturn = $false },
                @{ From = "Ctrl"; To = "Cita"; Y = 225; Text = "1.2. WhereDate(""fecha_cita"", hoy)->Count(), GroupBy(""estado"")"; IsReturn = $false },
                @{ From = "Cita"; To = "Ctrl"; Y = 270; Text = "RespuestaMetricasCitas()"; IsReturn = $true },
                @{ From = "Ctrl"; To = "Pac"; Y = 305; Text = "1.3. Count(), Where(""primera_visita"", true)->Count()"; IsReturn = $false },
                @{ From = "Pac"; To = "Ctrl"; Y = 350; Text = "RespuestaMetricasPacientes()"; IsReturn = $true },
                @{ From = "Ctrl"; To = "Atn"; Y = 385; Text = "1.4. WhereDate(""fecha_atencion"", hoy)->Count()"; IsReturn = $false },
                @{ From = "Atn"; To = "Ctrl"; Y = 430; Text = "RespuestaMetricasAtenciones()"; IsReturn = $true },
                @{ From = "Ctrl"; To = "UI"; Y = 475; Text = "RespuestaDashboardKPIs(data)"; IsReturn = $true },
                @{ From = "UI"; To = "Actor"; Y = 505; Text = "RenderizarTarjetasYGraficosKPI()"; IsReturn = $true }
            )
        },
        @{
            Condition = "[Filtrar métricas por rango de fechas personalizado]"
            NextSectionY = 980
            Activations = @(
                @{ Id = "Actor"; StartY = 590; Height = 330 },
                @{ Id = "UI"; StartY = 600; Height = 305 },
                @{ Id = "Ctrl"; StartY = 625; Height = 255 },
                @{ Id = "Cita"; StartY = 650; Height = 65 }
            )
            Messages = @(
                @{ From = "Actor"; To = "UI"; Y = 605; Text = "2. FiltrarRango(fechaInicio, fechaFin)"; IsReturn = $false },
                @{ From = "UI"; To = "Ctrl"; Y = 630; Text = "2.1. Metricas(RequestConFiltros)"; IsReturn = $false },
                @{ From = "Ctrl"; To = "Cita"; Y = 655; Text = "2.2. WhereBetween(""fecha_cita"", rango)->Count()"; IsReturn = $false },
                @{ From = "Cita"; To = "Ctrl"; Y = 710; Text = "RespuestaCitasRango()"; IsReturn = $true },
                @{ From = "Ctrl"; To = "UI"; Y = 820; Text = "RespuestaMetricasFiltradas()"; IsReturn = $true },
                @{ From = "UI"; To = "Actor"; Y = 855; Text = "ActualizarGraficosTendencias()"; IsReturn = $true }
            )
        }
    )

# ==============================================================================
# CU21: Generar reportes clínicos y estadísticos
# ==============================================================================
Generate-SequenceDiagram `
    -cuCode "CU21" `
    -title "Generación y exportación de reportes clínicos y estadísticos" `
    -lifelines @(
        @{ Id = "Actor"; Name = "Director Médico / Admin"; Type = "Actor"; X = 85 },
        @{ Id = "UI"; Name = "UI_ReportesClinicos"; Type = "Boundary"; X = 320 },
        @{ Id = "Ctrl"; Name = "ReportesController"; Type = "Control"; X = 650 },
        @{ Id = "Cita"; Name = "Cita"; Type = "Entity"; X = 980 },
        @{ Id = "Atn"; Name = "AtencionMedica"; Type = "Entity"; X = 1240 },
        @{ Id = "Aud"; Name = "BitacoraAuditoria"; Type = "Entity"; X = 1500 }
    ) `
    -altSections @(
        @{
            Condition = "[Generar reporte de productividad médica y morbilidad CIE-10]"
            NextSectionY = 560
            Activations = @(
                @{ Id = "Actor"; StartY = 160; Height = 350 },
                @{ Id = "UI"; StartY = 170; Height = 325 },
                @{ Id = "Ctrl"; StartY = 195; Height = 280 },
                @{ Id = "Cita"; StartY = 225; Height = 65 },
                @{ Id = "Atn"; StartY = 325; Height = 65 }
            )
            Messages = @(
                @{ From = "Actor"; To = "UI"; Y = 175; Text = "1. SolicitarReporte(tipo, rangoFechas, idEspecialidad)"; IsReturn = $false },
                @{ From = "UI"; To = "Ctrl"; Y = 205; Text = "1.1. ProductividadMedica(Request)"; IsReturn = $false },
                @{ From = "Ctrl"; To = "Cita"; Y = 235; Text = "1.2. Join(""medicos"")->WhereBetween(""fecha_cita"")->GroupBy(""id_medico"")"; IsReturn = $false },
                @{ From = "Cita"; To = "Ctrl"; Y = 285; Text = "RespuestaAgregadaProductividad()"; IsReturn = $true },
                @{ From = "Ctrl"; To = "Atn"; Y = 335; Text = "1.3. WhereBetween(""fecha_atencion"")->GroupBy(""diagnostico_cie10"")"; IsReturn = $false },
                @{ From = "Atn"; To = "Ctrl"; Y = 385; Text = "RespuestaMorbilidadCIE10()"; IsReturn = $true },
                @{ From = "Ctrl"; To = "UI"; Y = 445; Text = "RespuestaReporteClinico(indicadores, filas)"; IsReturn = $true },
                @{ From = "UI"; To = "Actor"; Y = 480; Text = "RenderizarTablasYMetricasKPI()"; IsReturn = $true }
            )
        },
        @{
            Condition = "[Exportar informe formal (Excel / CSV o PDF con auditoría)]"
            NextSectionY = 980
            Activations = @(
                @{ Id = "Actor"; StartY = 590; Height = 340 },
                @{ Id = "UI"; StartY = 600; Height = 315 },
                @{ Id = "Ctrl"; StartY = 625; Height = 270 },
                @{ Id = "Aud"; StartY = 655; Height = 65 }
            )
            Messages = @(
                @{ From = "Actor"; To = "UI"; Y = 605; Text = "2. ExportarReporte(formato: EXCEL_CSV | PDF)"; IsReturn = $false },
                @{ From = "UI"; To = "Ctrl"; Y = 635; Text = "2.1. AuditarExportacion(tipo, formato, filtros)"; IsReturn = $false },
                @{ From = "Ctrl"; To = "Aud"; Y = 665; Text = "2.2. Create([""modulo"" => ""REPORTES"", ""operacion"" => ""EXPORTACION""])"; IsReturn = $false },
                @{ From = "Aud"; To = "Ctrl"; Y = 715; Text = "RespuestaAuditoriaGuardada()"; IsReturn = $true },
                @{ From = "Ctrl"; To = "UI"; Y = 800; Text = "ConfirmacionOperacion()"; IsReturn = $true },
                @{ From = "UI"; To = "Actor"; Y = 840; Text = "DescargarArchivoCSV_O_ImprimirPDF()"; IsReturn = $true }
            )
        }
    )


