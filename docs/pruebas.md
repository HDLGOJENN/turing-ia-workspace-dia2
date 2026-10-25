# Pruebas funcionales — Turing-IA Día 2

## 1. Objetivo

Documentar las pruebas realizadas al sistema de automatización desarrollado con Google Sheets, Google Apps Script, Gmail y Google Calendar.

Se verificó el funcionamiento individual de las funciones, la ejecución mediante un activador instalable y las comprobaciones utilizadas para reducir acciones duplicadas.

## 2. Entorno de pruebas

| Componente | Configuración |
|---|---|
| Hoja de cálculo | Registro_Tareas_TuringIA |
| Pestaña | Tareas |
| Proyecto Apps Script | Automatizacion_TuringIA_Dia2 |
| Lenguaje | JavaScript |
| Activador | Instalable, tipo Al editar |
| Servicios | Sheets, Gmail y Calendar |
| Fecha de pruebas | 25/10/2026 |

Las pruebas utilizaron tareas simuladas y direcciones de correo propias.

## 3. Pruebas manuales

| ID | Caso de prueba | Resultado esperado | Resultado observado |
|---|---|---|---|
| CP01 | Calcular días restantes | Actualizar columna H | Exitoso |
| CP02 | Diagnosticar fechas | Mostrar información de los valores | Exitoso |
| CP03 | Enviar notificación de T001 | Recibir correo y registrar Enviado | Exitoso |
| CP04 | Crear evento de T001 | Registrar evento y guardar ID | Exitoso |
| CP05 | Evaluar condiciones de las tareas | Obtener decisiones de correo y evento | Exitoso |

## 4. Pruebas automáticas

| ID | Caso de prueba | Resultado esperado | Resultado observado |
|---|---|---|---|
| CP06 | Modificar Estado en Sheets | Ejecutar alEditarTarea | Exitoso |
| CP07 | Procesar T002 | Crear evento automático | Exitoso |
| CP08 | Procesar T004 | Enviar notificación automática | Exitoso |
| CP09 | Repetir edición de T004 | No repetir correo registrado | Exitoso |
| CP10 | Repetir edición de T002 | No recrear evento registrado | Exitoso |
| CP11 | Procesar T005 | Crear evento para nueva tarea | ID registrado en Sheets |
| CP12 | Procesar T006 | Crear evento para nueva tarea | ID registrado en Sheets |
| CP13 | Procesar T007 | Enviar correo y crear evento | Exitoso |

## 5. Prueba de integración generalizada

**Caso:** CP13 — T007.

**Condiciones:**

- Prioridad: Alta.
- Estado: Pendiente.
- Notificación previa: sin registrar.
- Evento previo: sin registrar.

**Resultado esperado:**

1. Detectar la edición de Estado.
2. Evaluar las condiciones de la tarea.
3. Enviar una notificación por correo electrónico.
4. Crear un evento en Google Calendar.
5. Actualizar los registros correspondientes en Google Sheets.

**Resultado observado:**

El registro de ejecución mostró la detección de T007, la evaluación positiva de ambas acciones, el envío del correo y la creación del evento.

Google Sheets registró la notificación enviada y el identificador del evento.

**Conclusión:** la prueba demuestra el funcionamiento del procesamiento generalizado para una tarea nueva.

## 6. Comprobaciones de duplicados

Se realizaron pruebas de edición repetida sobre tareas previamente procesadas.

**T004 — Gmail**

Al modificar nuevamente el Estado, el sistema identificó que la tarea tenía una notificación registrada y no solicitó otro envío.

**T002 — Calendar**

Al modificar nuevamente el Estado, el sistema identificó que existía un ID de evento y no solicitó crear otro.

Estos resultados verifican las comprobaciones de duplicados en los escenarios ensayados. No garantizan procesamiento exactamente una vez ante fallos parciales.

## 7. Manejo de errores y validaciones

El código contempla:

- Validación de la existencia de la hoja.
- Comprobación de campos obligatorios.
- Validación de fechas.
- Validación del formato de correo electrónico.
- Registro de errores mediante console.error.
- Uso de try, catch y finally.
- Liberación del bloqueo mediante LockService.

La implementación de estas validaciones puede verificarse en Codigo.gs. No se ejecutaron pruebas exhaustivas de todos los posibles fallos.

## 8. Evidencias destacadas

| Evidencia | Archivo |
|---|---|
| Notificación Gmail manual | 06_notificacion_gmail.jpeg |
| Evento de Google Calendar | 09_evento_google_calendario.png |
| Activador instalado | 13_trigger_configurado.png |
| Evaluación automática | 15_evaluacion_automatica_tareas.png |
| Evento automático T002 | 18_evento_automatico_trigger.png |
| Notificación automática T004 | 22_correo_automatico_trigger.png |
| Correo recibido T004 | 23_gmail_t004.jpeg |
| Prevención de duplicado Gmail | 25_prueba_no_duplicar_gmail.png |
| Prevención de duplicado Calendar | 26_prueba_no_duplicar_calendar.png |
| Integración generalizada T007 | 27_t007_integracion_gmail_calendar.png |

Los nombres abreviados deberán sustituirse por los nombres completos de los archivos de la carpeta evidencias.

## 9. Pruebas pendientes

Queda pendiente ampliar la cobertura a:

- Errores reales de envío de Gmail.
- Fallos durante la creación de eventos.
- Ejecuciones concurrentes.
- Recuperación ante fallos parciales.
- Sincronización de eventos cuando cambian las fechas.
- Procesamiento de inserciones masivas.

Estas pruebas se consideran mejoras futuras y no resultados verificados del prototipo.

## 10. Conclusión

Las pruebas realizadas permitieron verificar el cálculo de fechas, la evaluación de condiciones, las notificaciones por Gmail, la creación de eventos en Calendar y el procesamiento basado en ediciones de Google Sheets.

También se comprobó el funcionamiento generalizado con una nueva tarea T007 y la prevención de acciones repetidas en los escenarios ensayados.