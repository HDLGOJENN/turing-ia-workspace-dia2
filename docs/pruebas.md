# Pruebas funcionales — Turing-IA Día 2

## 1. Objetivo

Documentar las pruebas realizadas al sistema de automatización desarrollado con Google Sheets, Google Apps Script, Gmail y Google Calendar.

Se verificó el funcionamiento de las funciones principales, la ejecución mediante un activador instalable de edición, las comprobaciones utilizadas para reducir acciones duplicadas y el cálculo de vencimientos mediante `calcularDiasRestantes()`.

También se documenta la configuración de un activador temporal diario para actualizar automáticamente los días restantes de las tareas.

## 2. Entorno de pruebas

| Componente | Configuración |
|---|---|
| Hoja de cálculo | `Registro_Tareas_TuringIA` |
| Pestaña | `Tareas` |
| Proyecto Apps Script | `Automatizacion_TuringIA_Dia2` |
| Lenguaje | JavaScript (Google Apps Script) |
| Activador de edición | Instalable, tipo `Al editar` |
| Activador temporal | Basado en tiempo, ejecución diaria de 8:00 a 9:00 a. m. |
| Función programada | `calcularDiasRestantes()` |
| Servicios | Google Sheets, Gmail y Google Calendar |
| Fecha de pruebas | 25/10/2026 |

Las pruebas utilizaron tareas simuladas y direcciones de correo propias.

## 3. Pruebas manuales

| ID | Caso de prueba | Resultado esperado | Resultado observado |
|---|---|---|---|
| CP01 | Calcular días restantes | Actualizar columna H | Exitoso |
| CP02 | Diagnosticar fechas | Mostrar tipos y valores | Exitoso |
| CP03 | Enviar notificación de T001 | Recibir correo y registrar Enviado | Exitoso |
| CP04 | Crear evento de T001 | Crear evento y guardar ID | Exitoso |
| CP05 | Evaluar condiciones | Determinar acciones necesarias | Exitoso |
| CP14 | Recalcular T001–T007 manualmente | Procesar siete tareas y finalizar sin errores | Exitoso |

### Resultado de CP14

Se ejecutó manualmente la función `calcularDiasRestantes()`.

El registro de ejecución mostró el procesamiento de las siete tareas:

| Tarea | Días restantes registrados |
|---|---|
| T001 | 2 |
| T002 | 3 |
| T003 | 5 |
| T004 | 4 |
| T005 | 5 |
| T006 | 6 |
| T007 | 6 |

La ejecución finalizó con el mensaje:

`Cálculo de días finalizado correctamente`

**Resultado:** la función procesó las siete tareas sin registrar errores durante la prueba.

## 4. Pruebas automáticas y programación

| ID | Caso de prueba | Resultado esperado | Resultado observado |
|---|---|---|---|
| CP06 | Modificar Estado en Sheets | Ejecutar `alEditarTarea(e)` | Exitoso |
| CP07 | Procesar T002 | Crear evento automático | Exitoso |
| CP08 | Procesar T004 | Enviar notificación automática | Exitoso |
| CP09 | Repetir edición de T004 | No repetir correo registrado | Exitoso |
| CP10 | Repetir edición de T002 | No recrear evento registrado | Exitoso |
| CP11 | Procesar T005 | Crear evento para nueva tarea | ID registrado en Sheets |
| CP12 | Procesar T006 | Crear evento para nueva tarea | ID registrado en Sheets |
| CP13 | Procesar T007 | Enviar correo y crear evento | Exitoso |
| CP15 | Configurar activador temporal diario | Asociar `calcularDiasRestantes()` a una ejecución diaria | Configuración realizada en Apps Script |
| CP16 | Ejecución programada de vencimientos | Actualizar columna H automáticamente | Ejecución programada; sin registro automático observado |

## 5. Prueba de integración generalizada: T007

**Caso:** CP13 — Procesamiento automático de T007.

**Condiciones:**

- Prioridad: Alta.
- Estado: Pendiente.
- Notificación previa: sin registrar.
- Evento previo: sin registrar.

**Resultado esperado:**

1. Detectar la edición de Estado en la columna G.
2. Evaluar las condiciones de la tarea.
3. Enviar una notificación por correo electrónico.
4. Crear un evento en Google Calendar.
5. Actualizar los registros correspondientes en Google Sheets.

**Resultado observado:**

El registro de ejecución mostró la detección de T007, la evaluación positiva de ambas acciones, el envío del correo y la creación del evento.

Google Sheets registró la notificación como `Enviado` y almacenó el identificador del evento de Calendar.

**Conclusión:** la prueba demuestra el funcionamiento del procesamiento generalizado para una tarea nueva.

## 6. Comprobaciones de duplicados

Se realizaron pruebas de edición repetida sobre tareas previamente procesadas.

### T004 — Gmail

Al modificar nuevamente el Estado, el sistema identificó que la tarea tenía una notificación registrada.

La condición `necesitaNotificacion` fue `false`, por lo que no se ejecutó otro envío en la prueba observada.

### T002 — Calendar

Al modificar nuevamente el Estado, el sistema identificó que existía un ID de evento.

La condición `necesitaEvento` fue `false`, por lo que no se creó un segundo evento durante la prueba.

Estas comprobaciones reducen la posibilidad de acciones duplicadas, aunque no garantizan procesamiento exactamente una vez ante fallos parciales.

## 7. Activador temporal diario de vencimientos

Se configuró la programación del cálculo de días restantes mediante un activador basado en tiempo de Google Apps Script.

### Configuración

| Parámetro | Valor |
|---|---|
| Función | `calcularDiasRestantes()` |
| Implementación | Principal |
| Origen del evento | Basado en el tiempo |
| Frecuencia | Cronómetro por día |
| Horario | De 8:00 a 9:00 a. m. |
| Notificación de fallos | Notificar al instante |

### Funcionamiento

El activador está asociado a la función `calcularDiasRestantes()` para realizar las siguientes operaciones:

1. Consultar las tareas registradas en Google Sheets.
2. Obtener sus fechas límite y estados.
3. Calcular los días restantes de las tareas activas.
4. Identificar tareas completadas o fechas inválidas.
5. Actualizar los resultados en la columna H.
6. Registrar los mensajes de ejecución.

### Verificación funcional

Se ejecutó manualmente `calcularDiasRestantes()` y se comprobaron resultados para las tareas T001–T007.

El registro mostró la finalización correcta del cálculo.

La programación diaria permite que Google Apps Script invoque la misma función dentro del intervalo seleccionado. La prueba manual verifica el funcionamiento de la función; no constituye evidencia de una ejecución iniciada por el temporizador.

## 8. Validaciones y manejo de errores

El código contempla:

- Validación de la existencia de la hoja `Tareas`.
- Comprobación de identificadores y nombres de tareas.
- Validación de fechas límite.
- Validación del formato de correo electrónico.
- Evaluación de prioridad y estado.
- Registro de errores mediante `console.error`.
- Uso de `try`, `catch` y `finally`.
- Liberación del bloqueo mediante `LockService`.

La implementación de estas validaciones puede revisarse en `Codigo.gs`.

No se realizaron pruebas exhaustivas de todos los posibles fallos de Gmail, Calendar o concurrencia.

## 9. Evidencias destacadas

| Evidencia | Archivo |
|---|---|
| Notificación Gmail manual | `06_notificacion_gmail.jpeg` |
| Evento de Google Calendar | `09_evento_google_calendario.png` |
| Activador de edición | `13_trigger_configurado.png` |
| Evaluación automática | `15_evaluacion_automatica_tareas.png` |
| Evento automático T002 | `18_evento_automatico_trigger.png` |
| Notificación automática T004 | `22_correo_automatico_trigger.png` |
| Correo recibido T004 | `23_gmail_t004.jpeg` |
| Prevención de duplicado Gmail | `25_prueba_no_duplicar_gmail.png` |
| Prevención de duplicado Calendar | `26_prueba_no_duplicar_calendar.png` |
| Integración generalizada T007 | `27_t007_integracion_gmail_calendar.png` |
| Configuración temporal diaria | `28_trigger_temporal_configurado.png` |
| Prueba del cálculo de vencimientos | `29_prueba_calculo_programado.png` |

Las evidencias permiten relacionar las pruebas realizadas con los resultados observados en Google Workspace.

La evidencia 29 corresponde a una ejecución manual de la función utilizada por el temporizador.

## 10. Pruebas complementarias

Se identifican las siguientes pruebas que podrían ampliar la cobertura del prototipo:

- Comprobar el historial de una ejecución iniciada por el temporizador diario.
- Probar errores reales durante el envío de Gmail.
- Simular fallos durante la creación de eventos.
- Evaluar ejecuciones concurrentes.
- Comprobar recuperación ante fallos parciales.
- Probar sincronización de eventos cuando cambian las fechas.
- Evaluar inserciones y modificaciones masivas.

Estas pruebas representan posibles ampliaciones de cobertura y no resultados verificados.

## 11. Conclusión

Las pruebas realizadas permitieron verificar el cálculo de vencimientos, la evaluación de condiciones, el envío de notificaciones por Gmail, la creación de eventos en Google Calendar y el procesamiento automático basado en ediciones de Google Sheets.

También se comprobó el procesamiento generalizado con la tarea T007 y la prevención de acciones repetidas en los escenarios ensayados.

Adicionalmente, se configuró la programación temporal diaria de `calcularDiasRestantes()` entre las 8:00 y las 9:00 a. m. y se verificó manualmente el funcionamiento de la función sobre siete tareas.

La solución integra automatización por eventos y actualización programada de vencimientos, manteniendo responsabilidades independientes para cada proceso.