# Clínica Vida Salud — Sistema de Gestión de Citas Médicas

Plataforma web integral para la gestión médica institucional, control de agendas, turnos de 15 minutos, citas médicas con control estricto de concurrencia y bitácora de auditoría.

## 🏥 Tecnologías

- **Backend:** PHP 8.2+ / Laravel 11
- **Base de Datos:** PostgreSQL 16
- **Frontend:** React 18, Vite, Lucide Icons
- **Diseño:** Sistema de diseño médico moderno, responsive y accesible

## 📦 Arquitectura de Paquetes y Casos de Uso (CU01 - CU13)

### PKG01: Seguridad, Roles y Auditoría
- **CU01:** Iniciar y cerrar sesión (Autenticación segura con rate-limiting y recuperación por OTP).
- **CU02:** Consultar bitácora de auditoría (Trazabilidad completa con diferencias JSON y filtros por fecha/usuario/IP).
- **CU03:** Gestionar usuarios internos, roles y permisos (Matriz de privilegios RBAC: Administrador, Médico, Recepcionista).

### PKG02: Médicos y Especialidades
- **CU04:** Gestionar especialidades médicas.
- **CU05:** Gestionar médicos y asignación de consultorios.

### PKG03: Pacientes e Historial Clínico
- **CU06:** Registro y gestión de pacientes (Validación CI, teléfono y datos demográficos).

### PKG04: Agendas y Horarios Médicos
- **CU07:** Configurar turnos y fraccionamiento de agenda (Bloques exactos de 15 minutos).
- **CU08:** Registrar bloqueos de agenda médica (Control de ausencias, feriados y cirugías).
- **CU09:** Consultar disponibilidad de horarios médicos (Visualizador interactivo de cupos).

### PKG05: Gestión de Citas y Concurrencia
- **CU10:** Reservar cita médica con control de concurrencia (Prevención de sobrecupos con transacciones ACID).
- **CU11:** Reprogramar cita médica (Validación de disponibilidad y registro en historial).
- **CU12:** Cancelar cita médica (Liberación inmediata del slot).
- **CU13:** Registrar asistencia e inasistencia (Control de check-in en recepción).

## 🚀 Puesta en Marcha

### Backend
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
