Add-Type -AssemblyName System.Drawing

$width = 1750
$height = 1050
$bmp = New-Object System.Drawing.Bitmap $width, $height
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

# 1. Background
$g.Clear([System.Drawing.Color]::White)

# 2. Outer diagram boundary box
$outerPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(40, 40, 40), 1.5)
$g.DrawRectangle($outerPen, 25, 25, $width - 50, $height - 50)

# 3. Top-left EA-style frame tag
$tagFont = New-Object System.Drawing.Font("Arial", 9.5, [System.Drawing.FontStyle]::Bold)
$tagBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(30, 30, 30))
$tagText = "class CU14: Registrar y actualizar antecedentes clínicos base"
$g.DrawString($tagText, $tagFont, $tagBrush, 34, 30)

$tagPoly = @(
    [System.Drawing.Point]::new(25, 48),
    [System.Drawing.Point]::new(420, 48),
    [System.Drawing.Point]::new(435, 25)
)
$g.DrawLines($outerPen, $tagPoly)

# Fonts
$fontClassName = New-Object System.Drawing.Font("Arial", 10.5, [System.Drawing.FontStyle]::Bold)
$fontMember = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Regular)
$fontMultiplicity = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Bold)
$fontActor = New-Object System.Drawing.Font("Arial", 9, [System.Drawing.FontStyle]::Bold)

# Pens & Brushes
$borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(158, 123, 102), 1.2) # EA brown border
$divPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(190, 160, 140), 1.0)
$linePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(120, 120, 120), 1.2)
$textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(25, 25, 25))
$actorBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(250, 220, 195))
$actorBorderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(160, 100, 70), 1.5)

# Helper function to draw an EA class box
function Draw-EAClass {
    param(
        [string]$name,
        [string[]]$attributes,
        [string[]]$methods,
        [int]$x,
        [int]$y,
        [int]$w
    )

    $headerH = 28
    $attrH = ($attributes.Length * 17) + 8
    $methodH = ($methods.Length * 17) + 8
    $totalH = $headerH + $attrH + $methodH

    $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $totalH)

    # Cream gradient brush
    $colorTop = [System.Drawing.Color]::FromArgb(255, 252, 247)
    $colorBottom = [System.Drawing.Color]::FromArgb(254, 237, 224)
    $gradBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $colorTop, $colorBottom, 90.0)

    # Fill & Border
    $g.FillRectangle($gradBrush, $rect)
    $g.DrawRectangle($borderPen, $rect)

    # Class Name Header
    $sfCenter = New-Object System.Drawing.StringFormat
    $sfCenter.Alignment = [System.Drawing.StringAlignment]::Center
    $sfCenter.LineAlignment = [System.Drawing.StringAlignment]::Center
    $headerRect = New-Object System.Drawing.RectangleF($x, $y, $w, $headerH)
    $g.DrawString($name, $fontClassName, $textBrush, $headerRect, $sfCenter)

    # Line 1: Header divider
    $yDiv1 = $y + $headerH
    $g.DrawLine($divPen, $x, $yDiv1, $x + $w, $yDiv1)

    # Attributes
    $currY = $yDiv1 + 5
    foreach ($attr in $attributes) {
        $g.DrawString($attr, $fontMember, $textBrush, ($x + 8), $currY)
        $currY += 17
    }

    # Line 2: Attributes divider
    $yDiv2 = $y + $headerH + $attrH
    $g.DrawLine($divPen, $x, $yDiv2, $x + $w, $yDiv2)

    # Methods
    $currY = $yDiv2 + 5
    foreach ($m in $methods) {
        $g.DrawString($m, $fontMember, $textBrush, ($x + 8), $currY)
        $currY += 17
    }

    return @{
        X = $x; Y = $y; W = $w; H = $totalH;
        CenterX = [int]($x + ($w / 2));
        CenterY = [int]($y + ($totalH / 2));
        Top = $y; Bottom = ($y + $totalH);
        Left = $x; Right = ($x + $w);
    }
}

# ==========================================================
# 4. DRAW ACTOR (Médico / Recepcionista)
# ==========================================================
$actorX = 85
$actorY = 510

# Head
$headSize = 24
$g.FillEllipse($actorBrush, ($actorX - 12), ($actorY - 35), $headSize, $headSize)
$g.DrawEllipse($actorBorderPen, ($actorX - 12), ($actorY - 35), $headSize, $headSize)

# Body & Limbs
$g.DrawLine($actorBorderPen, $actorX, ($actorY - 11), $actorX, ($actorY + 18)) # Torso
$g.DrawLine($actorBorderPen, ($actorX - 18), ($actorY - 2), ($actorX + 18), ($actorY - 2)) # Arms
$g.DrawLine($actorBorderPen, $actorX, ($actorY + 18), ($actorX - 14), ($actorY + 42)) # Left leg
$g.DrawLine($actorBorderPen, $actorX, ($actorY + 18), ($actorX + 14), ($actorY + 42)) # Right leg

# Actor Label
$sfActor = New-Object System.Drawing.StringFormat
$sfActor.Alignment = [System.Drawing.StringAlignment]::Center
$g.DrawString("Médico /`nRecepcionista", $fontActor, $textBrush, $actorX, ($actorY + 48), $sfActor)


# ==========================================================
# 5. DRAW BOUNDARY: UI_AntecedentesClinicos
# ==========================================================
$uiAttrs = @(
    "- filtroTipoSangre: string",
    "- listaPacientes: Collection",
    "- pacienteSeleccionado: Paciente",
    "- searchTerm: string"
)
$uiMethods = @(
    "+ actualizarExpediente(): void",
    "+ consultarExpedientes(): void",
    "+ registrarAntecedentes(): void",
    "+ seleccionarPaciente(): void",
    "+ visualizarFichaClinica(): void"
)
$boxUI = Draw-EAClass "UI_AntecedentesClinicos" $uiAttrs $uiMethods 165 410 230


# ==========================================================
# 6. DRAW CONTROLLER: AntecedentesClinicosController
# ==========================================================
$ctrlAttrs = @()
$ctrlMethods = @(
    "+ index(Request): JsonResponse",
    "+ show(int): JsonResponse",
    "+ update(Request, int): JsonResponse"
)
$boxCtrl = Draw-EAClass "AntecedentesClinicosController" $ctrlAttrs $ctrlMethods 440 460 250


# ==========================================================
# 7. DRAW CENTRAL ENTITY: Paciente
# ==========================================================
$pacAttrs = @(
    "- apellidos: string",
    "- ci: string",
    "- direccion: string",
    "- email: string",
    "- estado: string",
    "- fecha_actualizacion: timestamp",
    "- fecha_creacion: timestamp",
    "- fecha_nacimiento: date",
    "- id_paciente: bigint",
    "- id_usuario: bigint",
    "- nombres: string",
    "- primera_visita: boolean",
    "- sexo: string",
    "- telefono: string"
)
$pacMethods = @(
    "+ contactoEmergencia(): HasOne",
    "+ find(): Paciente",
    "+ historiaClinica(): HasOne",
    "+ paginate(): LengthAwarePaginator"
)
$boxPac = Draw-EAClass "Paciente" $pacAttrs $pacMethods 745 365 245


# ==========================================================
# 8. DRAW TOP ENTITY: HistoriaClinica
# ==========================================================
$hcAttrs = @(
    "- alergias_medicamentos: text",
    "- antecedentes_patologicos: text",
    "- antecedentes_quirurgicos: text",
    "- enfermedades_hereditarias: text",
    "- fecha_actualizacion: timestamp",
    "- fecha_apertura: timestamp",
    "- id_historia_clinica: bigint",
    "- id_paciente: bigint",
    "- numero_expediente: string",
    "- tipo_sangre: string"
)
$hcMethods = @(
    "+ findByPaciente(): HistoriaClinica",
    "+ update(): boolean"
)
$boxHC = Draw-EAClass "HistoriaClinica" $hcAttrs $hcMethods 745 65 245


# ==========================================================
# 9. DRAW RIGHT ENTITY: ContactoEmergencia
# ==========================================================
$ceAttrs = @(
    "- direccion: string",
    "- id_contacto: bigint",
    "- id_paciente: bigint",
    "- nombre_completo: string",
    "- parentesco: string",
    "- telefono: string"
)
$ceMethods = @(
    "+ findByPaciente(): ContactoEmergencia",
    "+ updateOrCreate(): ContactoEmergencia"
)
$boxCE = Draw-EAClass "ContactoEmergencia" $ceAttrs $ceMethods 1060 380 235


# ==========================================================
# 10. DRAW BOTTOM ENTITY: BitacoraAuditoria
# ==========================================================
$audAttrs = @(
    "- direccion_ip: string",
    "- fecha_creacion: timestamp",
    "- id_bitacora: bigint",
    "- id_registro_afectado: bigint",
    "- id_usuario: bigint",
    "- modulo: string",
    "- operacion: string",
    "- tabla_afectada: string",
    "- user_agent: text",
    "- valores_anteriores: json",
    "- valores_nuevos: json"
)
$audMethods = @(
    "+ registrar(): BitacoraAuditoria"
)
$boxAud = Draw-EAClass "BitacoraAuditoria" $audAttrs $audMethods 745 745 245


# ==========================================================
# 11. DRAW CONNECTING LINES AND MULTIPLICITIES (EA Style)
# ==========================================================
# Actor to UI
$g.DrawLine($linePen, ($actorX + 22), ($actorY + 10), $boxUI.Left, ($actorY + 10))

# UI to Controller
$g.DrawLine($linePen, $boxUI.Right, $boxCtrl.CenterY, $boxCtrl.Left, $boxCtrl.CenterY)

# Controller to Paciente
$g.DrawLine($linePen, $boxCtrl.Right, $boxCtrl.CenterY, $boxPac.Left, $boxCtrl.CenterY)

# Paciente to HistoriaClinica (Vertical)
$g.DrawLine($linePen, $boxPac.CenterX, $boxPac.Top, $boxHC.CenterX, $boxHC.Bottom)
$g.DrawString("1", $fontMultiplicity, $textBrush, ($boxPac.CenterX + 5), ($boxPac.Top - 18))
$g.DrawString("1", $fontMultiplicity, $textBrush, ($boxHC.CenterX + 5), ($boxHC.Bottom + 5))

# Paciente to ContactoEmergencia (Horizontal)
$g.DrawLine($linePen, $boxPac.Right, ($boxPac.Top + 60), $boxCE.Left, ($boxPac.Top + 60))
$g.DrawString("1", $fontMultiplicity, $textBrush, ($boxPac.Right + 5), ($boxPac.Top + 42))
$g.DrawString("0..1", $fontMultiplicity, $textBrush, ($boxCE.Left - 32), ($boxPac.Top + 42))

# Paciente to BitacoraAuditoria (Vertical)
$g.DrawLine($linePen, $boxPac.CenterX, $boxPac.Bottom, $boxAud.CenterX, $boxAud.Top)
$g.DrawString("1", $fontMultiplicity, $textBrush, ($boxPac.CenterX + 5), ($boxPac.Bottom + 5))
$g.DrawString("0..*", $fontMultiplicity, $textBrush, ($boxAud.CenterX + 5), ($boxAud.Top - 18))

# Save image in project root
$outPathProject = "c:\Users\Daniel\Downloads\CITAS_MEDICAS-main\Diagrama_Analisis_Clases_CU14.png"
$bmp.Save($outPathProject, [System.Drawing.Imaging.ImageFormat]::Png)

# Save in duplicate folder as well
$outPathDuplicate = "c:\Users\Daniel\Downloads\CITAS_MEDICAS-main (1)\CITAS_MEDICAS-main\Diagrama_Analisis_Clases_CU14.png"
$bmp.Save($outPathDuplicate, [System.Drawing.Imaging.ImageFormat]::Png)

# Save image in artifact directory
$artifactDir = "C:\Users\Daniel\.gemini\antigravity\brain\ff5848d4-3680-49b5-b7df-90a270b6f24e"
$outPathArtifact = Join-Path $artifactDir "Diagrama_Analisis_Clases_CU14.png"
$bmp.Save($outPathArtifact, [System.Drawing.Imaging.ImageFormat]::Png)

$g.Dispose()
$bmp.Dispose()
Write-Output "Diagram successfully generated at: $outPathProject"
