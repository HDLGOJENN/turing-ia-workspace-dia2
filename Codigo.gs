function calcularDiasRestantes() {
  // Obtener la hoja de cálculo vinculada al script.
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  const hoja = libro.getSheetByName('Tareas');

  if (!hoja) {
    throw new Error('No se encontró la hoja Tareas');
  }

  // Obtener todas las filas con información.
  const ultimaFila = hoja.getLastRow();

  if (ultimaFila < 2) {
    console.log('No existen tareas para procesar');
    return;
  }

  // Leer los datos desde la columna A hasta la L.
  const datos = hoja.getRange(2, 1, ultimaFila - 1, 12).getValues();

  // Obtener el inicio del día actual.
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const milisegundosPorDia = 1000 * 60 * 60 * 24;

  const resultados = datos.map((fila, indice) => {
    const id = fila[0];
    const fechaLimite = fila[5];
    const estado = fila[6];

    // Ignorar filas vacías.
    if (!id) {
      return [''];
    }

    // Validar que la fecha sea correcta.

    const fechaConvertida = new Date(fechaLimite);

    if (isNaN(fechaConvertida.getTime())) {
      console.error(`Fila ${indice + 2}: Fecha inválida`);
      return ['Fecha inválida'];
    }


    // No calcular fechas de tareas completadas.
    if (estado === 'Completada') {
      return ['Completada'];
    }

    const fecha = fechaConvertida;
    fecha.setHours(0, 0, 0, 0);

    const dias = Math.round(
      (fecha.getTime() - hoy.getTime()) / milisegundosPorDia
    );

    console.log(`Tarea ${id}: ${dias} días restantes`);

    return [dias];
  });

  // Actualizar todas las celdas de la columna H.
  hoja.getRange(2, 8, resultados.length, 1)
    .setValues(resultados);

  console.log('Cálculo de días finalizado correctamente');
}

function diagnosticarFechas() {
  const hoja = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('Tareas');

  const fechas = hoja.getRange('F2:F4').getValues();

  fechas.forEach((fila, indice) => {
    const valor = fila[0];

    console.log('Fila: ' + (indice + 2));
    console.log('Valor: ' + valor);
    console.log('Tipo: ' + typeof valor);
    console.log('Es Date: ' + (valor instanceof Date));
  });
}

function enviarNotificacionPrueba() {
  const hoja = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('Tareas');

  if (!hoja) {
    throw new Error('No existe la hoja Tareas');
  }

  // Procesamos únicamente la tarea T001.
  const fila = 2;
  const datos = hoja.getRange(fila, 1, 1, 12).getValues()[0];

  const id = datos[0];
  const tarea = datos[1];
  const correo = String(datos[3]).trim();
  const prioridad = datos[4];
  const estado = datos[6];
  const diasRestantes = datos[7];
  const notificacion = datos[8];

  // Validar que sea la tarea esperada.
  if (id !== 'T001') {
    throw new Error('La fila 2 no corresponde a T001');
  }

  if (prioridad !== 'Alta' || estado !== 'Pendiente') {
    console.log('La tarea no cumple las condiciones');
    return;
  }

  // Evitar enviar dos veces la misma notificación.
  if (notificacion === 'Enviado') {
    console.log('Esta tarea ya fue notificada');
    return;
  }

  // Comprobar que existe un destinatario válido.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    throw new Error('Correo electrónico inválido');
  }

  // Construir el mensaje.
  const asunto = `[Turing-IA Prueba] Tarea urgente: ${id}`;

  const mensaje =
    `Hola,\n\n` +
    `Esta es una notificación de prueba.\n\n` +
    `Tarea: ${tarea}\n` +
    `Prioridad: ${prioridad}\n` +
    `Estado: ${estado}\n` +
    `Días restantes: ${diasRestantes}\n\n` +
    `Mensaje generado automáticamente con Google Apps Script.`;

  // Enviar el correo.
  MailApp.sendEmail({
    to: correo,
    subject: asunto,
    body: mensaje
  });

  // Registrar el resultado solo después del envío.
  hoja.getRange(fila, 9).setValue('Enviado');
  hoja.getRange(fila, 11).setValue(new Date());

  console.log(`Notificación enviada para la tarea ${id}`);
}

function crearEventoCalendarioPrueba() {
  const hoja = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('Tareas');

  if (!hoja) {
    throw new Error('No existe la hoja Tareas');
  }

  // Trabajamos únicamente con la tarea T001.
  const fila = 2;
  const datos = hoja.getRange(fila, 1, 1, 12).getValues()[0];

  const id = datos[0];
  const tarea = datos[1];
  const prioridad = datos[4];
  const fechaLimite = datos[5];
  const eventoExistente = datos[9];

  if (id !== 'T001') {
    throw new Error('La fila no corresponde a T001');
  }

  // Evitar crear eventos duplicados.
  if (eventoExistente) {
    console.log('La tarea ya tiene un evento registrado');
    return;
  }

  // Validar y convertir la fecha.
  const fecha = new Date(fechaLimite);

  if (isNaN(fecha.getTime())) {
    throw new Error('Fecha límite inválida');
  }

  // Obtenemos el calendario principal.
  const calendario = CalendarApp.getDefaultCalendar();

  if (!calendario) {
    throw new Error('No se encontró el calendario principal');
  }

  // Creamos un evento de día completo.
  const evento = calendario.createAllDayEvent(
    `[Turing-IA] ${id} - ${tarea}`,
    fecha,
    {
      description:
        `Evento generado mediante Apps Script.\n` +
        `Tarea: ${tarea}\n` +
        `Prioridad: ${prioridad}\n` +
        `Origen: Registro_Tareas_TuringIA`
    }
  );

  // Guardamos el identificador del evento.
  hoja.getRange(fila, 10).setValue(evento.getId());

  console.log(`Evento creado correctamente: ${evento.getId()}`);
}

function alEditarTarea(e) {
  // Verificar que la ejecución provenga de una edición real.
  if (!e || !e.range) {
    console.log('No se recibió un evento de edición');
    return;
  }
  // Obtenemos el rango modificado y su hoja.
  const rango = e.range;
  const hoja = rango.getSheet();

  // Procesar únicamente nuestra hoja Tareas.
  if (hoja.getName() !== 'Tareas') return;

  // Identificamos la fila y columna modificadas.
  const fila = rango.getRow();
  const columna = rango.getColumn();

  // Ignorar encabezados y ediciones múltiples.
  if (fila < 2 || rango.getNumRows() !== 1 ||
    rango.getNumColumns() !== 1) return;

  // Solo reaccionar a modificaciones de Estado (G).
  if (columna !== 7) return;

  // Obtenemos el identificador y estado de la tarea.
  const id = hoja.getRange(fila, 1).getValue();
  const estado = hoja.getRange(fila, 7).getValue();

  if (!id) return;

  console.log(
    `Edición detectada: tarea ${id}, fila ${fila}, estado ${estado}`
  );

  // Evaluar automáticamente la tarea modificada.
  try {
    // Evaluamos las acciones que necesita esta tarea.
    const resultado = evaluarTarea(fila);

    console.log(JSON.stringify({
      accion: 'Evaluación automática',
      tarea: resultado.tarea.id,
      necesitaNotificacion: resultado.necesitaNotificacion,
      necesitaEvento: resultado.necesitaEvento
    }));

    // Procesamos cualquier tarea válida cuya columna Estado
    // haya sido modificada en Google Sheets.
    // La función evaluará si necesita correo o evento.
    procesarTareaAutomatica(fila);


    // Para las demás tareas conservamos el modo de evaluación.
    console.log('Evaluación automática finalizada');

  } catch (error) {
    // Registramos el error para facilitar su depuración.
    console.error(`Error al evaluar la fila ${fila}: ${error.message}`);
    // Propagamos el error para identificar la ejecución fallida.
    throw error;
  }

}

function evaluarTarea(fila) {
  const hoja = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('Tareas');
  // Validamos que exista la hoja y la fila sea válida.
  if (!hoja || fila < 2) {
    throw new Error('Hoja o fila inválida');
  }
  // Leemos las doce columnas de la tarea.
  const datos = hoja.getRange(fila, 1, 1, 12).getValues()[0];
  // Convertimos los datos de la fila en un objeto.
  const tarea = {
    id: datos[0],
    nombre: datos[1],
    correo: String(datos[3] || '').trim(),
    prioridad: datos[4],
    fechaLimite: datos[5],
    estado: datos[6],
    notificacion: datos[8],
    eventoId: datos[9]
  };
  // Comprobamos los datos obligatorio
  if (!tarea.id || !tarea.nombre) {
    throw new Error('Faltan datos obligatorios');
  }

  // Validamos que la fecha pueda utilizarse.
  const fecha = new Date(tarea.fechaLimite);

  if (isNaN(fecha.getTime())) {
    throw new Error('Fecha límite inválida');
  }
  // Solo notificamos tareas urgentes y pendientes
  // que todavía no tengan una notificación registrada.
  const necesitaNotificacion =
    tarea.prioridad === 'Alta' &&
    tarea.estado === 'Pendiente' &&
    tarea.notificacion !== 'Enviado';
  // Creamos eventos para tareas activas que
  // todavía no tengan un evento registrado.
  const necesitaEvento =
    tarea.estado !== 'Completada' &&
    !tarea.eventoId;

  // Mostramos las decisiones para facilitar las pruebas.
  console.log(JSON.stringify({
    id: tarea.id,
    necesitaNotificacion,
    necesitaEvento
  }));

  // Devolvemos los datos y las decisiones
  return {
    tarea,
    necesitaNotificacion,
    necesitaEvento
  };
}
function probarEvaluacion() {
  evaluarTarea(2);
  evaluarTarea(3);
  evaluarTarea(4);
}

function procesarTareaAutomatica(fila) {
  const hoja = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('Tareas');

  if (!hoja || fila < 2) {
    throw new Error('Hoja o fila inválida');
  }
  // Obtenemos el bloqueo asociado al documento.
  // Bloqueo para evitar ejecuciones simultáneas.
  const bloqueo = LockService.getDocumentLock();

  // Esperamos hasta 10 segundos para adquirirlo.
  if (!bloqueo || !bloqueo.tryLock(10000)) {
    console.log('No se pudo obtener el bloqueo');
    return;
  }

  try {
    // Analizamos la tarea mientras tenemos el bloqueo.
    const resultado = evaluarTarea(fila);
    const tarea = resultado.tarea;

    // Enviamos una notificación a cualquier tarea que cumpla
    // las condiciones de prioridad, estado y envío previo.
    if (resultado.necesitaNotificacion) {

      // Comprobamos que el destinatario tenga un formato válido.
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tarea.correo)) {
        throw new Error('Correo electrónico inválido');
      }

      // Construimos el asunto y el mensaje de notificación.
      const asunto = `[Turing-IA Prueba] Tarea urgente: ${tarea.id}`;

      const mensaje =
        `Hola,\n\n` +
        `Se detectó una tarea urgente pendiente.\n\n` +
        `Tarea: ${tarea.nombre}\n` +
        `Prioridad: ${tarea.prioridad}\n` +
        `Estado: ${tarea.estado}\n\n` +
        `Notificación automática generada con Google Apps Script.`;

      // Enviamos la notificación desde la cuenta que ejecuta el trigger.
      MailApp.sendEmail({
        to: tarea.correo,
        subject: asunto,
        body: mensaje
      });

      // Registramos el resultado después de enviar el correo.
      hoja.getRange(fila, 9).setValue('Enviado');
      hoja.getRange(fila, 11).setValue(new Date());

      console.log(`Correo enviado automáticamente para ${tarea.id}`);
    }

    // Creamos un evento para cualquier tarea activa
    // que todavía no tenga un ID registrado en Sheets.
    if (resultado.necesitaEvento) {

      // Convertimos y validamos la fecha límite.
      const fecha = new Date(tarea.fechaLimite);

      if (isNaN(fecha.getTime())) {
        throw new Error('Fecha límite inválida');
      }

      // Obtenemos el calendario principal de Google.
      const calendario = CalendarApp.getDefaultCalendar();

      if (!calendario) {
        throw new Error('No se encontró el calendario');
      }

      // Creamos un evento de día completo para la tarea.
      const evento = calendario.createAllDayEvent(
        `[Turing-IA] ${tarea.id} - ${tarea.nombre}`,
        fecha,
        {
          description:
            `Evento automático de prueba.\n` +
            `Tarea: ${tarea.nombre}\n` +
            `Prioridad: ${tarea.prioridad}`
        }
      );

      // Guardamos el identificador del evento en la columna J.
      // Esto ayuda a evitar eventos duplicados en nuevas ejecuciones.
      hoja.getRange(fila, 10).setValue(evento.getId());

      console.log(`Evento creado automáticamente para ${tarea.id}`);

    } else {
      // Si la tarea ya tiene evento o está completada,
      // no necesitamos crear otro.
      console.log(`La tarea ${tarea.id} no necesita un evento nuevo`);
    }

    console.log(`Procesamiento seguro finalizado: ${tarea.id}`);


  } catch (error) {
    console.error(`Error en tarea, fila ${fila}: ${error.message}`);
    throw error;

  } finally {
    // Liberamos el bloqueo aunque ocurra una excepción.
    bloqueo.releaseLock();
  }
}
function probarProcesamientoSeguro() {
  procesarTareaAutomatica(3);
}
