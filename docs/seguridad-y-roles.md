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

No se crearon grupos reales porque la prueba se realizó sin Google Workspace empresarial.

## 6. Matriz de permisos propuesta

| Operación | Administrador | Coordinador | Colaborador | Auditor |
|---|---|---|---|---|
| Consultar tareas autorizadas | Sí | Sí | Sí | Sí |
| Registrar tareas | Sí | Sí | No | No |
| Modificar estados | Sí | Sí | Limitado | No |
| Modificar responsables | Sí | Sí | No | No |
| Consultar evidencias | Sí | Sí | Limitado | Sí |
| Modificar Apps Script | Sí | No | No | No |
| Configurar activadores | Sí | No | No | No |
| Administrar permisos | Sí | No | No | No |

Esta matriz constituye una propuesta de control de acceso basado en roles (RBAC).

La hoja de cálculo actual no aplica automáticamente todos estos permisos por perfil.

## 7. Principio de mínimo privilegio

Se plantea que cada usuario reciba únicamente los permisos necesarios para sus actividades.

Por ejemplo:

- Un auditor debería consultar los registros sin editarlos.
- Un colaborador no debería modificar el código de automatización.
- Un coordinador podría gestionar tareas sin administrar los permisos técnicos.
- Un administrador autorizado podría configurar los servicios y activadores.

Este diseño reduce el riesgo de modificaciones no autorizadas.

## 8. Controles de automatización

### 8.1 Validación del activador

La función `alEditarTarea(e)` comprueba:

1. Que exista un evento de edición válido.
2. Que la edición corresponda a la pestaña `Tareas`.
3. Que se haya editado una sola celda.
4. Que la modificación corresponda a la columna G.
5. Que exista un identificador de tarea.

### 8.2 Prevención de acciones repetidas

El sistema utiliza:

- Columna I: registro de notificación enviada.
- Columna J: identificador del evento generado.
- `LockService`: coordinación de ejecuciones.

Estos controles reducen el riesgo de duplicación durante el procesamiento.

### 8.3 Gestión de errores

Se utilizan bloques `try`, `catch` y `finally` para registrar errores y liberar los bloqueos de procesamiento.

Las ejecuciones pueden revisarse desde el historial de Google Apps Script.

## 9. Riesgos y limitaciones

| Riesgo o limitación | Medida aplicada o recomendada |
|---|---|
| Acceso no autorizado a la hoja | Mantener acceso restringido |
| Modificación accidental de registros | Utilizar validaciones y permisos de edición |
| Envío repetido de correos | Comprobar el estado `Enviado` |
| Duplicación de eventos | Comprobar el ID registrado |
| Ejecuciones simultáneas | Utilizar LockService |
| Errores de datos | Validar campos obligatorios y fechas |
| Exposición de información en GitHub | Revisar código y anonimizar capturas |
| Fallo después de una acción externa | Implementar controles adicionales de recuperación en una versión futura |

## 10. Mejoras propuestas para un entorno empresarial

En una implementación empresarial real se recomienda:

1. Utilizar cuentas administradas de Google Workspace.
2. Crear usuarios y grupos desde Google Admin Console.
3. Asignar permisos según las responsabilidades.
4. Separar el acceso administrativo del operativo.
5. Proteger los rangos y documentos sensibles.
6. Definir políticas de compartición y acceso.
7. Revisar periódicamente los permisos otorgados.
8. Implementar auditoría y recuperación ante errores.

## 11. Conclusión

El prototipo implementa controles básicos de acceso y validación, además de mecanismos para reducir acciones duplicadas y conflictos de ejecución.

Se diseñó un modelo de usuarios, grupos y roles para demostrar cómo podría ampliarse la solución a un entorno empresarial.

La gestión real de identidades, grupos y políticas administrativas de Google Workspace queda fuera del alcance de la configuración realizada con una cuenta personal.