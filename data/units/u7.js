export default {
  id: 'u7',
  title: 'Unterwegs',
  titleEs: 'Transporte',
  place: 'Yucatán',
  country: 'MX',
  emoji: '🚌',
  lessons: [
    {
      id: 'u7l1',
      title: 'Die Uhrzeit',
      goal: 'Du lernst, nach der Uhrzeit zu fragen und sie zu verstehen.',
      cando: 'Ich kann nach der Uhrzeit fragen und einfache Uhrzeiten verstehen.',
      situation: 'Uhrzeit',
      items: [
        { id: 'que-hora-es', es: '¿Qué hora es?', de: 'Wie spät ist es?', emoji: '⌚' },
        { id: 'es-la-una', es: 'Es la una.', de: 'Es ist ein Uhr.', emoji: '🕐' },
        { id: 'son-las-tres', es: 'Son las tres.', de: 'Es ist drei Uhr.', emoji: '🕒' },
        { id: 'y-media', es: 'Son las cuatro y media.', de: 'Es ist halb fünf.', emoji: '🕟', note: 'Achtung: 4 + halb = 4:30!' },
        { id: 'y-cuarto', es: 'Son las dos y cuarto.', de: 'Es ist Viertel nach zwei.', emoji: '🕑' },
        { id: 'de-la-manana', es: 'de la mañana', de: 'morgens / vormittags', emoji: '🌅' },
        { id: 'de-la-tarde', es: 'de la tarde', de: 'nachmittags', emoji: '🌇' },
        { id: 'a-las-ocho', es: 'a las ocho', de: 'um acht Uhr', emoji: '🕗' },
      ],
      tip: {
        title: 'Halb fünf ist nicht halb fünf!',
        text: 'Deutsche Falle: „halb fünf“ ist 4:30. Auf Spanisch sagt man „las cuatro y media“ – vier und eine halbe. Also immer die Stunde, die gerade läuft, plus „y media“.',
      },
      scene: {
        title: 'An der Bushaltestelle',
        intro: 'Dein Handy ist leer. Du fragst eine Frau nach der Uhrzeit.',
        lines: [
          { who: 'you', options: [
            { es: 'Disculpe, ¿qué hora es?', de: 'Entschuldigung, wie spät ist es?', ok: true },
            { es: 'Disculpe, ¿qué tal?', de: 'Entschuldigung, wie geht’s?', ok: false, why: 'Du willst die Uhrzeit wissen.' },
          ] },
          { who: 'npc', name: 'Señora', es: 'Son las diez y media.', de: 'Es ist halb elf.' },
          { who: 'you', options: [
            { es: '¿Las diez y media? Gracias.', de: 'Halb elf? Danke.', ok: true },
            { es: '¿Las nueve y media? Gracias.', de: 'Halb zehn? Danke.', ok: false, why: '„Las diez y media“ = 10:30, also halb elf.' },
          ] },
        ],
      },
      news: 'n25',
    },
    {
      id: 'u7l2',
      title: 'Mit dem Bus',
      goal: 'Du lernst, eine Busfahrkarte zu kaufen.',
      cando: 'Ich kann eine Fahrkarte kaufen und nach der Abfahrt fragen.',
      situation: 'Bus & Bahn',
      items: [
        { id: 'el-autobus', es: 'el autobús', de: 'der Bus', emoji: '🚌', alt: ['el camión'], note: 'In Mexiko sagt man oft „camión“' },
        { id: 'un-billete', es: 'un boleto a Mérida', de: 'eine Fahrkarte nach Mérida', emoji: '🎫', alt: ['un billete'], note: 'In Spanien: „billete“' },
        { id: 'ida-y-vuelta', es: 'de ida y vuelta', de: 'hin und zurück', emoji: '🔁' },
        { id: 'solo-ida', es: 'solo de ida', de: 'nur hin', emoji: '➡️' },
        { id: 'a-que-hora-sale', es: '¿A qué hora sale el autobús?', de: 'Um wie viel Uhr fährt der Bus ab?', emoji: '🕐' },
        { id: 'a-que-hora-llega', es: '¿A qué hora llega?', de: 'Um wie viel Uhr kommt er an?', emoji: '🏁' },
        { id: 'de-que-anden', es: '¿De qué andén sale?', de: 'Von welchem Bussteig fährt er ab?', emoji: '🚏' },
      ],
      tip: {
        title: 'Camión = Bus',
        text: 'In Spanien ist ein „camión“ ein Lastwagen, in Mexiko ein Bus! Für Fernreisen in Mexiko gibt es bequeme Reisebusse (ADO), mit Klimaanlage – oft sehr kalt, also nimm eine Jacke mit.',
      },
      scene: {
        title: 'Am Busbahnhof',
        intro: 'Du willst von Cancún nach Mérida fahren.',
        lines: [
          { who: 'you', options: [
            { es: 'Buenos días, un boleto a Mérida, por favor.', de: 'Guten Morgen, eine Fahrkarte nach Mérida, bitte.', ok: true },
            { es: 'Buenos días, una mesa para dos.', de: 'Guten Morgen, einen Tisch für zwei.', ok: false, why: 'Am Schalter kaufst du einen „boleto“.' },
          ] },
          { who: 'npc', name: 'Taquillero', es: '¿Solo de ida o de ida y vuelta?', de: 'Nur hin oder hin und zurück?' },
          { who: 'you', options: [
            { es: 'Solo de ida. ¿A qué hora sale?', de: 'Nur hin. Um wie viel Uhr fährt er?', ok: true },
            { es: 'A la derecha.', de: 'Rechts.', ok: false, why: 'Er fragt: einfach oder hin und zurück?' },
          ] },
          { who: 'npc', name: 'Taquillero', es: 'Sale a las once, del andén cuatro.', de: 'Er fährt um elf, von Bussteig vier.' },
          { who: 'you', options: [
            { es: 'A las once, andén cuatro. Gracias.', de: 'Um elf, Bussteig vier. Danke.', ok: true },
            { es: 'A las cuatro, andén once.', de: 'Um vier, Bussteig elf.', ok: false, why: 'Genau andersherum: um 11 Uhr, Bussteig 4.' },
          ] },
        ],
      },
      news: 'n26',
    },
    {
      id: 'u7l3',
      title: 'Mit dem Taxi',
      goal: 'Du lernst, sicher Taxi zu fahren.',
      cando: 'Ich kann ein Ziel nennen, nach dem Preis fragen und den Fahrer bitten anzuhalten.',
      situation: 'Taxi',
      items: [
        { id: 'al-aeropuerto', es: 'Al aeropuerto, por favor.', de: 'Zum Flughafen, bitte.', emoji: '✈️' },
        { id: 'a-esta-direccion', es: 'A esta dirección, por favor.', de: 'Zu dieser Adresse, bitte.', emoji: '📍' },
        { id: 'cuanto-cuesta-ir', es: '¿Cuánto cuesta ir al centro?', de: 'Was kostet die Fahrt ins Zentrum?', emoji: '💰' },
        { id: 'pare-aqui', es: 'Pare aquí, por favor.', de: 'Halten Sie bitte hier.', emoji: '🛑' },
        { id: 'tengo-prisa', es: 'Tengo prisa.', de: 'Ich habe es eilig.', emoji: '⏱️' },
        { id: 'el-aeropuerto', es: 'el aeropuerto', de: 'der Flughafen', emoji: '🛫' },
        { id: 'el-taxi', es: 'el taxi', de: 'das Taxi', emoji: '🚕' },
      ],
      tip: {
        title: 'Erst fragen, dann einsteigen',
        text: 'In Mexiko haben viele Taxis keinen Taxameter. Frag vor dem Einsteigen: „¿Cuánto cuesta ir a …?“ An Flughäfen kaufst du am sichersten ein Ticket am offiziellen Taxi-Schalter.',
      },
      scene: {
        title: 'Zum Flughafen',
        intro: 'Du winkst ein Taxi heran.',
        lines: [
          { who: 'npc', name: 'Taxista', es: 'Buenas, ¿adónde va?', de: 'Hallo, wohin fahren Sie?' },
          { who: 'you', options: [
            { es: 'Al aeropuerto. ¿Cuánto cuesta?', de: 'Zum Flughafen. Was kostet das?', ok: true },
            { es: 'La cuenta, por favor.', de: 'Die Rechnung, bitte.', ok: false, why: 'Er fragt, wohin du willst.' },
          ] },
          { who: 'npc', name: 'Taxista', es: 'Trescientos pesos.', de: 'Dreihundert Pesos.' },
          { who: 'you', options: [
            { es: 'Muy bien. Tengo prisa, por favor.', de: 'Sehr gut. Ich habe es eilig, bitte.', ok: true },
            { es: 'Solo estoy mirando.', de: 'Ich schaue nur.', ok: false, why: 'Du brauchst das Taxi wirklich!' },
          ] },
          { who: 'npc', name: 'Taxista', es: 'No se preocupe, llegamos en veinte minutos.', de: 'Keine Sorge, wir sind in zwanzig Minuten da.' },
        ],
      },
      news: 'n27',
    },
    {
      id: 'u7l4',
      title: 'Wann? Gestern, heute, morgen',
      goal: 'Du lernst Wochentage und Zeitwörter für deine Reisepläne.',
      cando: 'Ich kann Wochentage nennen und sagen, wann ich etwas mache.',
      situation: 'Zeit & Pläne',
      items: [
        { id: 'lunes', es: 'el lunes', de: 'am Montag', emoji: '📅' },
        { id: 'martes', es: 'el martes', de: 'am Dienstag', emoji: '📅' },
        { id: 'miercoles', es: 'el miércoles', de: 'am Mittwoch', emoji: '📅' },
        { id: 'viernes', es: 'el viernes', de: 'am Freitag', emoji: '📅' },
        { id: 'el-fin-de-semana', es: 'el fin de semana', de: 'das Wochenende', emoji: '🎉' },
        { id: 'ayer', es: 'ayer', de: 'gestern', emoji: '⏪' },
        { id: 'manana-por-la-manana', es: 'mañana por la mañana', de: 'morgen früh', emoji: '🌄' },
        { id: 'voy-a', es: 'Mañana voy a Chichén Itzá.', de: 'Morgen fahre ich nach Chichén Itzá.', emoji: '🛕' },
      ],
      tip: {
        title: 'Mañana, mañana',
        text: '„Mañana“ heißt „morgen“ UND „der Morgen“. „Mañana por la mañana“ ist also „morgen früh“. Und „voy a …“ (ich gehe/fahre nach …) ist der einfachste Weg, über Pläne zu sprechen.',
      },
      scene: {
        title: 'Pläne schmieden',
        intro: 'Die Rezeptionistin im Hotel in Mérida plaudert mit dir.',
        lines: [
          { who: 'npc', name: 'Recepcionista', es: '¿Qué va a hacer mañana?', de: 'Was machen Sie morgen?' },
          { who: 'you', options: [
            { es: 'Mañana voy a Chichén Itzá.', de: 'Morgen fahre ich nach Chichén Itzá.', ok: true },
            { es: 'Ayer, gracias.', de: 'Gestern, danke.', ok: false, why: 'Sie fragt nach morgen.' },
          ] },
          { who: 'npc', name: 'Recepcionista', es: '¡Qué bien! Vaya temprano, a las ocho, porque hace mucho calor.', de: 'Wie schön! Fahren Sie früh, um acht, weil es sehr heiß wird.' },
          { who: 'you', options: [
            { es: '¿A las ocho de la mañana? Muy bien.', de: 'Um acht Uhr morgens? Sehr gut.', ok: true },
            { es: '¿A las ocho de la tarde?', de: 'Um acht Uhr abends?', ok: false, why: 'Morgens ist es kühler – „de la mañana“.' },
          ] },
        ],
      },
      news: 'n28',
    },
  ],
  finale: {
    title: 'Ausflug zu den Maya-Ruinen',
    intro: 'Du organisierst deinen Ausflug nach Chichén Itzá – vom Taxi bis zum Bus.',
    lines: [
      { who: 'npc', name: 'Taxista', es: 'Buenos días, ¿adónde la llevo?', de: 'Guten Morgen, wohin darf ich Sie bringen?' },
      { who: 'you', options: [
        { es: 'A la estación de autobuses, por favor. Tengo prisa.', de: 'Zum Busbahnhof, bitte. Ich habe es eilig.', ok: true },
        { es: 'A la playa, por favor. Solo estoy mirando.', de: 'Zum Strand, bitte. Ich schaue nur.', ok: false, why: 'Du willst zum Busbahnhof.' },
      ] },
      { who: 'note', de: 'Am Busbahnhof, am Schalter.' },
      { who: 'you', options: [
        { es: 'Un boleto a Chichén Itzá, de ida y vuelta, por favor.', de: 'Eine Fahrkarte nach Chichén Itzá, hin und zurück, bitte.', ok: true },
        { es: 'Un kilo de mangos, por favor.', de: 'Ein Kilo Mangos, bitte.', ok: false, why: 'Hier kaufst du eine Fahrkarte.' },
      ] },
      { who: 'npc', name: 'Taquillera', es: 'Son seiscientos pesos. Sale a las ocho y cuarto.', de: 'Das macht 600 Pesos. Er fährt um Viertel nach acht.' },
      { who: 'you', options: [
        { es: '¿A qué hora llega?', de: 'Um wie viel Uhr kommt er an?', ok: true },
        { es: '¿Pica?', de: 'Ist es scharf?', ok: false, why: 'Ein Bus ist nicht scharf 😄 Frag nach der Ankunft.' },
      ] },
      { who: 'npc', name: 'Taquillera', es: 'Llega a las diez y media.', de: 'Er kommt um halb elf an.' },
      { who: 'you', options: [
        { es: 'Muy bien. ¿De qué andén sale?', de: 'Sehr gut. Von welchem Bussteig fährt er?', ok: true },
        { es: '¿Las nueve y media?', de: 'Halb zehn?', ok: false, why: '„Las diez y media“ = halb elf.' },
      ] },
      { who: 'npc', name: 'Taquillera', es: 'Del andén dos. ¡Buen viaje!', de: 'Von Bussteig zwei. Gute Reise!' },
      { who: 'you', options: [
        { es: '¡Muchas gracias! ¡Hasta luego!', de: 'Vielen Dank! Bis später!', ok: true },
        { es: 'Lo siento.', de: 'Es tut mir leid.', ok: false, why: 'Bedank dich und verabschiede dich.' },
      ] },
    ],
  },
};
