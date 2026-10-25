# Turing-IA | Día 2 — Automatización con Google Workspace

## 1. Descripción del proyecto

Prototipo funcional de automatización de tareas desarrollado con Google Apps Script, Google Sheets, Gmail y Google Calendar.

El sistema permite registrar tareas, calcular días restantes, evaluar prioridades y estados, enviar notificaciones por correo electrónico y generar eventos de seguimiento en Google Calendar.

La automatización utiliza un activador instalable que detecta modificaciones individuales en la columna Estado de Google Sheets.

## 2. Tecnologías utilizadas

- **Google Sheets:** almacenamiento y administración de tareas.
- **Google Apps Script (JavaScript):** lógica de negocio y automatización.
- **Gmail / MailApp:** envío de notificaciones.
- **Google Calendar / CalendarApp:** creación de eventos.
- **LockService:** coordinación de ejecuciones concurrentes.
- **Google Drive:** organización de los archivos y evidencias.

## 3. Estructura del proyecto

```text
dia2-workspace/
├── Codigo.gs
├── README.md
├── docs/
└── evidencias/
```

## 4. Funcionalidades

- Registro y seguimiento de tareas en Google Sheets.
- Cálculo manual de días restantes.
- Validación de fechas y correos electrónicos.
- Identificación de tareas urgentes según prioridad y estado.
- Envío automático de notificaciones mediante Gmail.
- Creación automática de eventos de día completo en Google Calendar.
- Registro de notificaciones enviadas e identificadores de eventos.
- Comprobaciones para reducir acciones duplicadas.
- Registro de ejecuciones y errores para facilitar el diagnóstico.

## 5. Flujo de automatización

1. El usuario modifica individualmente el Estado de una tarea en la columna G.
2. El activador instalable ejecuta `alEditarTarea(e)`.
3. La función identifica la fila y verifica que la edición sea válida.
4. `evaluarTarea(fila)` determina qué acciones necesita la tarea.
5. `procesarTareaAutomatica(fila)` obtiene un bloqueo y vuelve a evaluar las condiciones.
6. Si la tarea es de prioridad Alta, está Pendiente y no ha sido notificada, se envía un correo.
7. Si la tarea no está Completada y no tiene un ID de evento, se crea un evento en Calendar.
8. Los resultados se registran en Google Sheets.

## 6. Reglas de negocio

**Notificaciones**

Se envía un correo cuando se cumplen las siguientes condiciones:

- Prioridad: `Alta`.
- Estado: `Pendiente`.
- Columna Notificación: diferente de `Enviado`.
- Dirección de correo con formato válido.

**Eventos**

Se crea un evento cuando:

- La tarea no tiene estado `Completada`.
- No existe un ID de evento registrado.
- La fecha límite es válida.

## 7. Funciones principales

| Función | Responsabilidad |
|---|---|
| `calcularDiasRestantes()` | Calcula y actualiza los días restantes. |
| `diagnosticarFechas()` | Inspecciona los tipos de datos de fechas. |
| `enviarNotificacionPrueba()` | Prueba manual de correo para T001. |
| `crearEventoCalendarioPrueba()` | Prueba manual de Calendar para T001. |
| `alEditarTarea(e)` | Detecta modificaciones en la columna Estado. |
| `evaluarTarea(fila)` | Determina si se necesita correo o evento. |
| `procesarTareaAutomatica(fila)` | Ejecuta las acciones y coordina el acceso con LockService. |
| `probarEvaluacion()` | Ejecuta evaluaciones de prueba. |
| `probarProcesamientoSeguro()` | Prueba el procesamiento de la fila 3. |

## 8. Configuración y ejecución

El proyecto fue desarrollado mediante Google Apps Script vinculado a una hoja de cálculo de Google Sheets.

### 8.1 Estructura de la hoja

La pestaña debe llamarse `Tareas` y contener las siguientes columnas:

| Columna | Nombre | Descripción |
|---|---|---|
| A | ID | Identificador de la tarea |
| B | Tarea | Nombre o descripción |
| C | Responsable | Persona encargada |
| D | Correo | Destinatario de la notificación |
| E | Prioridad | Alta, Media o Baja |
| F | Fecha límite | Fecha de vencimiento |
| G | Estado | Pendiente, En proceso o Completada |
| H | Días restantes | Resultado del cálculo |
| I | Notificación | Registro del correo enviado |
| J | ID evento | Identificador del evento en Calendar |
| K | Fecha procesamiento | Fecha del envío del correo |
| L | Observaciones | Información adicional |

### 8.2 Configuración de Apps Script

1. Crear la hoja de cálculo con la pestaña `Tareas`.
2. Abrir **Extensiones → Apps Script**.
3. Incorporar el contenido del archivo `Codigo.gs`.
4. Guardar el proyecto.
5. Autorizar los permisos necesarios para utilizar Google Sheets, Gmail y Calendar.

### 8.3 Configuración del trigger

1. Abrir la sección **Activadores** de Google Apps Script.
2. Seleccionar **Añadir activador**.
3. Elegir la función `alEditarTarea`.
4. Seleccionar **Hoja de cálculo** como origen del evento.
5. Seleccionar **Al editar** como tipo de evento.
6. Guardar y conceder los permisos correspondientes.

El trigger reacciona a modificaciones individuales realizadas en la columna G de la pestaña `Tareas`.

### 8.4 Ejecución

**Manual:**

- `calcularDiasRestantes()`: actualiza la columna H.
- `diagnosticarFechas()`: inspecciona los valores de fecha.
- `enviarNotificacionPrueba()`: prueba el envío de Gmail para T001.
- `crearEventoCalendarioPrueba()`: prueba la creación de un evento para T001.

**Automática:**

Al modificar individualmente el estado de una tarea, `alEditarTarea(e)` identifica la fila y llama al procesamiento automático.

El sistema evalúa si corresponde enviar una notificación, crear un evento o no realizar ninguna acción.

Las acciones se ejecutan mediante la cuenta que autorizó el activador.

## 9. Pruebas realizadas

Se realizaron pruebas manuales y automáticas para verificar el funcionamiento del sistema.

### 9.1 Pruebas manuales

| ID | Prueba | Resultado |
|---|---|---|
| CP01 | Cálculo de días restantes | Exitoso |
| CP02 | Validación y diagnóstico de fechas | Exitoso |
| CP03 | Envío manual de correo para T001 | Exitoso |
| CP04 | Creación manual de evento para T001 | Exitoso |
| CP05 | Evaluación de prioridades y estados | Exitoso |

### 9.2 Pruebas automáticas

| ID | Prueba | Resultado |
|---|---|---|
| CP06 | Detección de cambios mediante trigger | Exitoso |
| CP07 | Creación automática de evento para T002 | Exitoso |
| CP08 | Envío automático de correo para T004 | Exitoso |
| CP09 | Prevención de notificación repetida para T004 | Exitoso |
| CP10 | Prevención de evento repetido para T002 | Exitoso |
| CP11 | Creación de evento para nueva tarea T005 | ID registrado en Sheets |
| CP12 | Creación de evento para nueva tarea T006 | ID registrado en Sheets |
| CP13 | Envío automático de Gmail y creación de Calendar para T007 | Exitoso |

### 9.3 Validación de procesamiento generalizado

Se modificó el código para eliminar las restricciones que limitaban las acciones automáticas a identificadores específicos.

Durante las pruebas de nuevas tareas se registraron identificadores de eventos para T005 y T006.

Adicionalmente, se verificó el procesamiento de T007, una tarea nueva de prioridad Alta y estado Pendiente.

El registro de ejecución de Apps Script confirmó:

- Identificación de la tarea T007.
- Evaluación positiva de las condiciones de notificación y evento.
- Envío de correo mediante MailApp.
- Creación de evento mediante CalendarApp.
- Registro de resultados en Google Sheets.
- Finalización del procesamiento automático.

Estas pruebas proporcionan evidencia del funcionamiento generalizado del sistema.


## 10. Seguridad y limitaciones

- La hoja de cálculo de pruebas utiliza acceso restringido.
- Se valida el formato del destinatario antes del envío.
- Se comprueba la existencia de registros previos para reducir duplicados.
- `LockService` ayuda a coordinar ejecuciones simultáneas.
- No se almacenan contraseñas ni claves de servicio en el código.
- El proyecto utiliza una cuenta personal para simular parte de los escenarios de Google Workspace.

El sistema no garantiza procesamiento exactamente una vez ante fallos parciales. Tampoco incluye recordatorios periódicos, sincronización de eventos existentes ni administración real de usuarios y grupos empresariales.

### Consideraciones adicionales

El sistema utiliza `LockService` para reducir conflictos entre ejecuciones simultáneas. Antes de enviar correos o crear eventos, comprueba los registros existentes en Google Sheets.

Estas medidas reducen la posibilidad de acciones repetidas, pero no garantizan procesamiento exactamente una vez si ocurre un fallo entre una acción externa y su registro en la hoja.

El trigger está configurado para reaccionar únicamente a ediciones individuales de la columna Estado. Los cambios en otras columnas no activan por sí mismos el procesamiento.

El cálculo de días restantes se ejecuta manualmente y no existe un activador temporal configurado para actualizarlo diariamente.

La administración empresarial de usuarios, grupos y roles de Google Workspace se documenta como simulación, ya que no se configuró un dominio empresarial real.

## 11. Evidencias

Las evidencias se encuentran organizadas dentro de la carpeta `evidencias/`.

Se incluyen capturas de:

- Configuración de Google Sheets.
- Validaciones y estados de tareas.
- Ejecuciones manuales de Google Apps Script.
- Activador instalable de edición.
- Correos generados mediante Gmail.
- Eventos creados en Google Calendar.
- Registros de procesamiento automático.
- Comprobaciones de prevención de duplicados.
- Procesamiento generalizado de la tarea T007.

**Evidencia destacada:**

`27_t007_integracion_gmail_calendar.png`

Esta captura muestra el procesamiento automático de una tarea nueva mediante el trigger, incluyendo el envío de Gmail y la creación del evento en Calendar.

Las evidencias permiten relacionar las pruebas funcionales con los resultados observados en Google Workspace.

## 12. Alcance del proyecto

El proyecto implementa un prototipo funcional de automatización de tareas mediante Google Workspace.

El sistema permite:

1. Registrar y administrar tareas en Google Sheets.
2. Calcular manualmente días restantes.
3. Evaluar prioridades y estados.
4. Validar información necesaria para el procesamiento.
5. Enviar notificaciones automáticas por Gmail.
6. Crear eventos de seguimiento en Google Calendar.
7. Registrar acciones realizadas.
8. Reducir acciones duplicadas mediante comprobaciones de estado y registros existentes.
9. Procesar nuevas tareas sin depender de identificadores específicos.
10. Consultar registros de ejecución para diagnosticar problemas.

Se comprobó el funcionamiento de las integraciones mediante pruebas manuales y automáticas, incluyendo el procesamiento generalizado de T007.

El alcance corresponde a un prototipo técnico para demostrar la integración y automatización de servicios de Google Workspace.

No incluye recordatorios periódicos, actualización automática de eventos existentes, administración empresarial real de usuarios y grupos ni mecanismos avanzados de recuperación ante fallos.