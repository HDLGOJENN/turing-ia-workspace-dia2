# Seguridad, usuarios y roles — Turing-IA Día 2

## 1. Objetivo

Documentar las medidas de seguridad aplicadas al prototipo de automatización de tareas y definir un modelo de usuarios, grupos y permisos para un entorno empresarial de Google Workspace.

La implementación se realizó utilizando una cuenta personal de Google. Por esta razón, la administración empresarial de usuarios, grupos y unidades organizativas se presenta como una simulación de diseño y no como una configuración real de Google Admin Console.

## 2. Entorno utilizado

Servicios utilizados:

- Google Drive.
- Google Sheets.
- Google Apps Script.
- Gmail.
- Google Calendar.

El proyecto utiliza una hoja de cálculo denominada `Registro_Tareas_TuringIA`, vinculada al proyecto `Automatizacion_TuringIA_Dia2`.

Google Sheets funciona como repositorio de información y Apps Script ejecuta la lógica de automatización.

## 3. Seguridad aplicada

### 3.1 Acceso a los archivos

Se utilizó una configuración de acceso restringido para la hoja de cálculo.

Esto evita habilitar el acceso público mediante enlaces compartidos.

La cuenta propietaria conserva el control de acceso al documento.

### 3.2 Permisos de Apps Script

El script utiliza servicios de Google para realizar operaciones específicas:

| Servicio | Operación | Justificación |
|---|---|---|
| SpreadsheetApp | Leer y actualizar tareas | Consultar información y registrar resultados |
| MailApp | Enviar correos electrónicos | Notificar tareas urgentes |
| CalendarApp | Crear eventos | Registrar fechas límite |
| LockService | Obtener bloqueos de ejecución | Reducir conflictos entre procesos simultáneos |

Las operaciones utilizan las autorizaciones otorgadas a Google Apps Script por la cuenta correspondiente.

El activador instalable se ejecuta con los permisos de la cuenta que lo creó.

### 3.3 Protección de credenciales

El código desarrollado no requiere almacenar contraseñas, claves privadas ni tokens de servicio escritos directamente en `Codigo.gs`.

La autorización de acceso a los servicios se gestiona mediante Google Apps Script.

### 3.4 Validación de información

El sistema realiza comprobaciones antes de ejecutar acciones:

- Verifica que exista la pestaña `Tareas`.
- Comprueba que la fila sea válida.
- Revisa que la tarea tenga identificador y nombre.
- Valida que la fecha límite pueda interpretarse.
- Comprueba el formato del correo cuando necesita enviar una notificación.
- Evalúa la prioridad y el estado de la tarea.

Estas validaciones reducen errores, aunque no sustituyen controles completos de seguridad empresarial.

## 4. Modelo de usuarios propuesto

Se diseñó una simulación de los siguientes perfiles:

| Usuario o perfil | Responsabilidad | Permisos propuestos |
|---|---|---|
| Administrador | Configurar servicios, permisos y automatizaciones | Administración de recursos autorizados |
| Coordinador | Registrar, asignar y supervisar tareas | Edición de tareas |
| Colaborador | Consultar tareas y actualizar su estado | Acceso limitado a las tareas autorizadas |
| Auditor | Revisar evidencias y resultados | Solo lectura |

**Nota:** estos perfiles representan un diseño propuesto. No se crearon como usuarios empresariales reales en Google Workspace.

## 5. Grupos de Google Workspace propuestos

En un entorno empresarial podrían utilizarse los siguientes grupos:

| Grupo | Integrantes propuestos | Objetivo |
|---|---|---|
| `administradores` | Administradores técnicos | Gestionar la plataforma |
| `coordinadores` | Responsables de equipo | Administrar tareas |
| `colaboradores` | Personal operativo | Consultar y actualizar información |
| `auditores` | Supervisores o evaluadores | Revisar información sin modificarla |

Los grupos permitirían administrar permisos de manera centralizada en lugar de asignarlos individualmente.

No se crearon grupos reales porque la prueba se