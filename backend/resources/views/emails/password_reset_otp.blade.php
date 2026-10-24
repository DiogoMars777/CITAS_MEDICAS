<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperación de Contraseña - Clínica Vida Salud</title>
    <style>
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            background-color: #f1f5f9;
            margin: 0;
            padding: 30px 15px;
            color: #1e293b;
        }
        .container {
            max-width: 540px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
            border: 1px solid #e2e8f0;
        }
        .header {
            background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
            padding: 35px 30px;
            text-align: center;
            color: #ffffff;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            letter-spacing: -0.5px;
            font-weight: 700;
        }
        .header p {
            margin: 6px 0 0;
            font-size: 13px;
            opacity: 0.9;
        }
        .content {
            padding: 35px 30px;
        }
        .greeting {
            font-size: 17px;
            font-weight: 600;
            color: #0f172a;
            margin-bottom: 12px;
        }
        .text {
            font-size: 14px;
            line-height: 1.6;
            color: #475569;
            margin-bottom: 25px;
        }
        .otp-box {
            background: #f8fafc;
            border: 2px dashed #38bdf8;
            border-radius: 12px;
            padding: 22px;
            text-align: center;
            margin: 25px 0;
        }
        .otp-code {
            font-size: 34px;
            font-weight: 800;
            letter-spacing: 8px;
            color: #0284c7;
            font-family: monospace, Courier;
        }
        .otp-caption {
            font-size: 12px;
            color: #64748b;
            margin-top: 8px;
        }
        .warning-card {
            background: #fffbeb;
            border-left: 4px solid #f59e0b;
            padding: 14px 18px;
            border-radius: 6px;
            font-size: 12.5px;
            color: #92400e;
            line-height: 1.5;
            margin-bottom: 25px;
        }
        .footer {
            background: #f8fafc;
            padding: 22px 30px;
            text-align: center;
            border-top: 1px solid #f1f5f9;
            font-size: 12px;
            color: #94a3b8;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Clínica Vida Salud</h1>
            <p>Sistema Web de Gestión de Citas Médicas</p>
        </div>
        <div class="content">
            <div class="greeting">Hola, {{ $username }}</div>
            <p class="text">
                Hemos recibido una solicitud para restablecer la contraseña de acceso a tu cuenta en la plataforma de la <strong>Clínica Vida Salud</strong>.
            </p>

            <div class="otp-box">
                <div class="otp-code">{{ $otp }}</div>
                <div class="otp-caption">Este código es de un solo uso y expirará en <strong>15 minutos</strong>.</div>
            </div>

            <div class="warning-card">
                <strong>Importante:</strong> Si tú no solicitaste este cambio, puedes ignorar este mensaje de forma segura. Tu contraseña actual no sufrirá ninguna modificación.
            </div>

            <p class="text" style="font-size: 13px; color: #64748b;">
                Por motivos de seguridad, nunca compartas este código con nadie. El personal médico o administrativo de la clínica nunca te solicitará tu código por teléfono o mensaje.
            </p>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} Clínica Vida Salud. Todos los derechos reservados.<br>
            Plataforma segura con cifrado de datos.
        </div>
    </div>
</body>
</html>
