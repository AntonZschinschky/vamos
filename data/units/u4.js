export default {
  id: 'u4',
  title: 'Im Hotel',
  titleEs: 'En el hotel',
  place: 'Barcelona',
  country: 'ES',
  emoji: '🏨',
  lessons: [
    {
      id: 'u4l1',
      title: 'Einchecken',
      goal: 'Du lernst, im Hotel einzuchecken.',
      cando: 'Ich kann sagen, dass ich eine Reservierung habe, und einchecken.',
      situation: 'Hotel',
      items: [
        { id: 'tengo-reserva', es: 'Tengo una reserva.', de: 'Ich habe eine Reservierung.', emoji: '📋' },
        { id: 'a-nombre-de', es: 'a nombre de {name}', de: 'auf den Namen {name}', emoji: '🪪' },
        { id: 'la-habitacion', es: 'la habitación', de: 'das Zimmer', emoji: '🛏️' },
        { id: 'la-llave', es: 'la llave', de: 'der Schlüssel', emoji: '🔑' },
        { id: 'el-pasaporte', es: 'el pasaporte', de: 'der Reisepass', emoji: '🛂' },
        { id: 'una-noche', es: 'una noche', de: 'eine Nacht', emoji: '🌙' },
        { id: 'tres-noches', es: 'tres noches', de: 'drei Nächte', emoji: '🌙' },
        { id: 'el-desayuno', es: '¿El desayuno está incluido?', de: 'Ist das Frühstück inklusive?', emoji: '🍳' },
      ],
      tip: {
        title: 'Tengo – ich habe',
        text: '„Tengo“ ist eines der nützlichsten Wörter: „Tengo una reserva“ (ich habe eine Reservierung), „Tengo una pregunta“ (ich habe eine Frage). Das „ich“ (yo) lässt man im Spanischen meistens weg.',
      },
      scene: {
        title: 'Check-in',
        intro: 'Du kommst mit deinem Koffer an der Rezeption an.',
        lines: [
          { who: 'npc', name: 'Recepcionista', es: 'Buenas tardes, ¿en qué puedo ayudarle?', de: 'Guten Tag, wie kann ich Ihnen helfen?' },
          { who: 'you', options: [
            { es: 'Buenas tardes. Tengo una reserva a nombre de {name}.', de: 'Guten Tag. Ich habe eine Reservierung auf den Namen {name}.', ok: true },
            { es: 'Buenas tardes. ¿Dónde está la playa?', de: 'Guten Tag. Wo ist der Strand?', ok: false, why: 'Erst einchecken: „Tengo una reserva …“' },
          ] },
          { who: 'npc', name: 'Recepcionista', es: 'Muy bien. Su pasaporte, por favor.', de: 'Sehr gut. Ihren Reisepass, bitte.' },
          { who: 'you', options: [
            { es: 'Aquí tiene.', de: 'Bitte schön.', ok: true },
            { es: 'No, gracias.', de: 'Nein, danke.', ok: false, why: 'Den Pass musst du zeigen – „Aquí tiene“.' },
          ] },
          { who: 'npc', name: 'Recepcionista', es: 'Gracias. Tres noches, ¿verdad?', de: 'Danke. Drei Nächte, richtig?' },
          { who: 'you', options: [
            { es: 'Sí, tres noches. ¿El desayuno está incluido?', de: 'Ja, drei Nächte. Ist das Frühstück inklusive?', ok: true },
            { es: 'No entiendo, adiós.', de: 'Ich verstehe nicht, tschüss.', ok: false, why: 'Du hast „tres noches“ verstanden – bestätige mit „Sí“.' },
          ] },
          { who: 'npc', name: 'Recepcionista', es: 'Sí, de siete a diez. Aquí tiene la llave.', de: 'Ja, von sieben bis zehn. Hier ist der Schlüssel.' },
        ],
      },
      news: 'n13',
    },
    {
      id: 'u4l2',
      title: 'Im Zimmer',
      goal: 'Du lernst Dinge im Hotelzimmer.',
      cando: 'Ich kann die wichtigsten Dinge im Hotelzimmer benennen.',
      situation: 'Hotel',
      items: [
        { id: 'la-cama', es: 'la cama', de: 'das Bett', emoji: '🛏️' },
        { id: 'la-ducha', es: 'la ducha', de: 'die Dusche', emoji: '🚿' },
        { id: 'la-toalla', es: 'la toalla', de: 'das Handtuch', emoji: '🧺' },
        { id: 'el-aire', es: 'el aire acondicionado', de: 'die Klimaanlage', emoji: '❄️' },
        { id: 'la-ventana', es: 'la ventana', de: 'das Fenster', emoji: '🪟' },
        { id: 'el-ascensor', es: 'el ascensor', de: 'der Aufzug', emoji: '🛗' },
        { id: 'el-wifi', es: '¿Cuál es la contraseña del wifi?', de: 'Wie ist das WLAN-Passwort?', emoji: '📶', note: 'wifi spricht man „ui-fi“' },
      ],
      tip: {
        title: 'Stockwerke zählen anders',
        text: 'In Spanien ist „la planta baja“ (PB oder 0 im Aufzug) das Erdgeschoss. „La primera planta“ ist also der 1. Stock – wie bei uns. In Mexiko heißt das Erdgeschoss „planta baja“, der Stock oft „piso“.',
      },
      scene: {
        title: 'Anruf bei der Rezeption',
        intro: 'Im Zimmer fehlen Handtücher. Du rufst an.',
        lines: [
          { who: 'npc', name: 'Recepción', es: 'Recepción, dígame.', de: 'Rezeption, bitte sprechen Sie.' },
          { who: 'you', options: [
            { es: 'Hola, no hay toallas en la habitación.', de: 'Hallo, im Zimmer gibt es keine Handtücher.', ok: true },
            { es: 'Hola, ¿dónde está la playa?', de: 'Hallo, wo ist der Strand?', ok: false, why: 'Dir fehlen Handtücher: „No hay toallas.“' },
          ] },
          { who: 'npc', name: 'Recepción', es: 'Lo siento mucho. ¿Qué habitación es?', de: 'Das tut mir sehr leid. Welches Zimmer ist es?' },
          { who: 'you', options: [
            { es: 'La habitación cuatro, uno, dos.', de: 'Zimmer vier, eins, zwei.', ok: true },
            { es: 'Tres noches.', de: 'Drei Nächte.', ok: false, why: 'Sie fragt nach der Zimmernummer.' },
          ] },
          { who: 'npc', name: 'Recepción', es: 'Ahora mismo se las subimos.', de: 'Wir bringen sie Ihnen sofort hoch.' },
        ],
      },
      news: 'n14',
    },
    {
      id: 'u4l3',
      title: 'Etwas funktioniert nicht',
      goal: 'Du lernst, ein Problem zu melden.',
      cando: 'Ich kann sagen, dass etwas nicht funktioniert, und um Hilfe bitten.',
      situation: 'Hotel',
      items: [
        { id: 'no-funciona', es: 'No funciona.', de: 'Es funktioniert nicht.', emoji: '🔧' },
        { id: 'la-ducha-no-funciona', es: 'La ducha no funciona.', de: 'Die Dusche funktioniert nicht.', emoji: '🚿' },
        { id: 'no-hay-agua-caliente', es: 'No hay agua caliente.', de: 'Es gibt kein warmes Wasser.', emoji: '🥶' },
        { id: 'hace-calor', es: 'Hace mucho calor.', de: 'Es ist sehr heiß.', emoji: '🥵' },
        { id: 'hay-ruido', es: 'Hay mucho ruido.', de: 'Es ist sehr laut.', emoji: '🔊' },
        { id: 'puede-ayudarme', es: '¿Puede ayudarme, por favor?', de: 'Können Sie mir bitte helfen?', emoji: '🆘' },
        { id: 'otra-habitacion', es: '¿Tiene otra habitación?', de: 'Haben Sie ein anderes Zimmer?', emoji: '🔄' },
      ],
      tip: {
        title: 'Verneinen ist ganz leicht',
        text: 'Stell einfach „no“ vor das Verb: „funciona“ (funktioniert) → „no funciona“. „Hay agua“ → „no hay agua“. Fertig – keine Wortumstellung wie im Deutschen.',
      },
      scene: {
        title: 'An der Rezeption',
        intro: 'Morgens: Die Dusche ist eiskalt. Du gehst zur Rezeption.',
        lines: [
          { who: 'you', options: [
            { es: 'Buenos días. No hay agua caliente en la ducha.', de: 'Guten Morgen. In der Dusche gibt es kein warmes Wasser.', ok: true },
            { es: 'Buenos días. Hace mucho calor.', de: 'Guten Morgen. Es ist sehr heiß.', ok: false, why: 'Das Wasser ist kalt – „No hay agua caliente.“' },
          ] },
          { who: 'npc', name: 'Recepcionista', es: 'Ay, perdone. Mandamos a alguien ahora.', de: 'Oh, entschuldigen Sie. Wir schicken jetzt jemanden.' },
          { who: 'you', options: [
            { es: 'Gracias. Y hay mucho ruido. ¿Tiene otra habitación?', de: 'Danke. Und es ist sehr laut. Haben Sie ein anderes Zimmer?', ok: true },
            { es: 'De nada.', de: 'Gern geschehen.', ok: false, why: '„De nada“ sagt man, wenn jemand DIR dankt.' },
          ] },
          { who: 'npc', name: 'Recepcionista', es: 'Sí, tenemos una habitación tranquila en la quinta planta.', de: 'Ja, wir haben ein ruhiges Zimmer im fünften Stock.' },
        ],
      },
      news: 'n15',
    },
    {
      id: 'u4l4',
      title: 'Auschecken',
      goal: 'Du lernst, auszuchecken und nach Hilfe für die Abreise zu fragen.',
      cando: 'Ich kann auschecken, bezahlen und ein Taxi bestellen lassen.',
      situation: 'Hotel',
      items: [
        { id: 'la-cuenta', es: 'la cuenta', de: 'die Rechnung', emoji: '🧾' },
        { id: 'con-tarjeta', es: '¿Puedo pagar con tarjeta?', de: 'Kann ich mit Karte zahlen?', emoji: '💳' },
        { id: 'en-efectivo', es: 'en efectivo', de: 'in bar', emoji: '💵' },
        { id: 'la-maleta', es: 'la maleta', de: 'der Koffer', emoji: '🧳' },
        { id: 'puedo-dejar', es: '¿Puedo dejar la maleta aquí?', de: 'Kann ich den Koffer hier lassen?', emoji: '🧳' },
        { id: 'un-taxi', es: '¿Puede llamar un taxi?', de: 'Können Sie ein Taxi rufen?', emoji: '🚕' },
        { id: 'a-que-hora-salida', es: '¿A qué hora es la salida?', de: 'Um wie viel Uhr ist der Check-out?', emoji: '🕚' },
      ],
      tip: {
        title: '¿Puedo …? – Darf ich …?',
        text: 'Mit „¿Puedo …?“ (Kann/Darf ich …?) und „¿Puede …?“ (Können Sie …?) kannst du fast jede Bitte bilden. Einfach das Verb in Grundform dahinter: „¿Puedo pagar?“ – „¿Puede llamar?“',
      },
      scene: {
        title: 'Check-out',
        intro: 'Dein Flug geht erst am Abend.',
        lines: [
          { who: 'you', options: [
            { es: 'Buenos días, la cuenta, por favor.', de: 'Guten Morgen, die Rechnung, bitte.', ok: true },
            { es: 'Buenos días, tengo una reserva.', de: 'Guten Morgen, ich habe eine Reservierung.', ok: false, why: 'Du reist ab – du brauchst die Rechnung.' },
          ] },
          { who: 'npc', name: 'Recepcionista', es: 'Aquí tiene. ¿Cómo va a pagar?', de: 'Bitte schön. Wie werden Sie bezahlen?' },
          { who: 'you', options: [
            { es: '¿Puedo pagar con tarjeta?', de: 'Kann ich mit Karte zahlen?', ok: true },
            { es: '¿Puede repetir el wifi?', de: 'Können Sie das WLAN wiederholen?', ok: false, why: 'Sie fragt, wie du zahlst.' },
          ] },
          { who: 'npc', name: 'Recepcionista', es: 'Claro que sí.', de: 'Aber natürlich.' },
          { who: 'you', options: [
            { es: 'Gracias. ¿Puedo dejar la maleta aquí?', de: 'Danke. Kann ich den Koffer hier lassen?', ok: true },
            { es: 'La ducha no funciona.', de: 'Die Dusche funktioniert nicht.', ok: false, why: 'Dein Flug geht erst abends – frag nach dem Koffer.' },
          ] },
          { who: 'npc', name: 'Recepcionista', es: 'Sí, hasta las seis.', de: 'Ja, bis sechs Uhr.' },
        ],
      },
      news: 'n16',
    },
  ],
  finale: {
    title: 'Ein Abend mit Hindernissen',
    intro: 'Du kommst in Barcelona an – und im Zimmer ist es heiß und laut.',
    lines: [
      { who: 'npc', name: 'Recepcionista', es: 'Bona nit! Buenas noches, ¿en qué puedo ayudarle?', de: 'Guten Abend (auf Katalanisch und Spanisch)! Wie kann ich helfen?' },
      { who: 'you', options: [
        { es: 'Buenas noches. Tengo una reserva a nombre de {name}.', de: 'Guten Abend. Ich habe eine Reservierung auf den Namen {name}.', ok: true },
        { es: 'Buenas noches. La cuenta, por favor.', de: 'Guten Abend. Die Rechnung, bitte.', ok: false, why: 'Du kommst gerade erst an.' },
      ] },
      { who: 'npc', name: 'Recepcionista', es: 'Perfecto. Habitación doscientos tres. El ascensor está a la derecha.', de: 'Perfekt. Zimmer 203. Der Aufzug ist rechts.' },
      { who: 'you', options: [
        { es: 'Gracias. ¿El desayuno está incluido?', de: 'Danke. Ist das Frühstück inklusive?', ok: true },
        { es: 'No hay toallas.', de: 'Es gibt keine Handtücher.', ok: false, why: 'Du warst noch gar nicht im Zimmer.' },
      ] },
      { who: 'npc', name: 'Recepcionista', es: 'Sí, señora.', de: 'Ja, gnädige Frau.' },
      { who: 'note', de: 'Zehn Minuten später – du rufst die Rezeption an.' },
      { who: 'you', options: [
        { es: 'Hola, el aire acondicionado no funciona y hace mucho calor.', de: 'Hallo, die Klimaanlage funktioniert nicht, und es ist sehr heiß.', ok: true },
        { es: 'Hola, ¿cuánto cuesta un café?', de: 'Hallo, was kostet ein Kaffee?', ok: false, why: 'Das Problem ist die Klimaanlage.' },
      ] },
      { who: 'npc', name: 'Recepcionista', es: 'Lo siento. ¿Quiere otra habitación?', de: 'Das tut mir leid. Möchten Sie ein anderes Zimmer?' },
      { who: 'you', options: [
        { es: 'Sí, por favor. Muchas gracias.', de: 'Ja, bitte. Vielen Dank.', ok: true },
        { es: 'No entiendo. Adiós.', de: 'Ich verstehe nicht. Tschüss.', ok: false, why: '„Otra habitación“ = ein anderes Zimmer – genau das willst du!' },
      ] },
    ],
  },
};
