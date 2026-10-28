export default {
  id: 'u3',
  title: 'Wo ist …?',
  titleEs: '¿Dónde está…?',
  place: 'Sevilla',
  country: 'ES',
  emoji: '🧭',
  lessons: [
    {
      id: 'u3l1',
      title: 'Orte in der Stadt',
      goal: 'Du lernst die wichtigsten Orte in einer Stadt.',
      cando: 'Ich kann wichtige Orte in der Stadt benennen.',
      situation: 'In der Stadt',
      items: [
        { id: 'el-bano', es: 'el baño', de: 'die Toilette', emoji: '🚻', alt: ['el aseo', 'el servicio'], note: 'In Spanien auch „el aseo“' },
        { id: 'la-estacion', es: 'la estación', de: 'der Bahnhof', emoji: '🚉' },
        { id: 'la-playa', es: 'la playa', de: 'der Strand', emoji: '🏖️' },
        { id: 'el-museo', es: 'el museo', de: 'das Museum', emoji: '🏛️' },
        { id: 'la-farmacia', es: 'la farmacia', de: 'die Apotheke', emoji: '💊' },
        { id: 'el-supermercado', es: 'el supermercado', de: 'der Supermarkt', emoji: '🛒' },
        { id: 'la-iglesia', es: 'la iglesia', de: 'die Kirche', emoji: '⛪' },
        { id: 'el-centro', es: 'el centro', de: 'das Zentrum', emoji: '🏙️' },
      ],
      tip: {
        title: 'el oder la?',
        text: 'Jedes Wort hat „el“ (männlich) oder „la“ (weiblich). Faustregel: Endet es auf -o, ist es meist „el“ (el museo), endet es auf -a, meist „la“ (la playa). Lern das „el“ oder „la“ einfach mit.',
      },
      scene: {
        title: 'Im Museum',
        intro: 'Du bist im Museum und musst dringend zur Toilette.',
        lines: [
          { who: 'you', options: [
            { es: 'Disculpe, ¿el baño?', de: 'Entschuldigung, die Toilette?', ok: true },
            { es: 'Disculpe, ¿la playa?', de: 'Entschuldigung, der Strand?', ok: false, why: 'Du suchst die Toilette: „el baño“.' },
          ] },
          { who: 'npc', name: 'Guardia', es: 'Sí, allí.', de: 'Ja, dort.' },
          { who: 'you', options: [
            { es: '¡Gracias!', de: 'Danke!', ok: true },
            { es: 'Lo siento.', de: 'Es tut mir leid.', ok: false, why: 'Er hat dir geholfen – „¡Gracias!“' },
          ] },
        ],
      },
      news: 'n09',
    },
    {
      id: 'u3l2',
      title: 'Nach dem Weg fragen',
      goal: 'Du lernst, nach dem Weg zu fragen.',
      cando: 'Ich kann fragen, wo etwas ist und ob es weit ist.',
      situation: 'Weg fragen',
      items: [
        { id: 'donde-esta', es: '¿Dónde está la estación?', de: 'Wo ist der Bahnhof?', emoji: '🧭' },
        { id: 'donde-hay', es: '¿Dónde hay una farmacia?', de: 'Wo gibt es eine Apotheke?', emoji: '💊' },
        { id: 'hay', es: 'hay', de: 'es gibt', emoji: '✨', note: 'gesprochen wie „ai“' },
        { id: 'esta-lejos', es: '¿Está lejos?', de: 'Ist es weit?', emoji: '🗺️' },
        { id: 'cerca', es: 'cerca', de: 'nah', emoji: '📍' },
        { id: 'lejos', es: 'lejos', de: 'weit', emoji: '🏔️' },
        { id: 'aqui', es: 'aquí', de: 'hier', emoji: '👇' },
        { id: 'alli', es: 'allí', de: 'dort', emoji: '👉' },
      ],
      tip: {
        title: 'Está oder hay?',
        text: 'Kennst du den Ort schon, fragst du mit „está“: „¿Dónde está el museo?“ (das bestimmte Museum). Suchst du irgendeinen: „¿Dónde hay una farmacia?“ – Wo gibt es eine Apotheke?',
      },
      scene: {
        title: 'Auf der Plaza',
        intro: 'Du suchst eine Apotheke und fragst einen jungen Mann.',
        lines: [
          { who: 'you', options: [
            { es: 'Disculpe, ¿dónde hay una farmacia?', de: 'Entschuldigung, wo gibt es eine Apotheke?', ok: true },
            { es: 'Disculpe, ¿cuánto es?', de: 'Entschuldigung, wie viel macht das?', ok: false, why: 'Du suchst eine Apotheke: „¿Dónde hay una farmacia?“' },
          ] },
          { who: 'npc', name: 'Chico', es: 'Hay una farmacia en el centro.', de: 'Es gibt eine Apotheke im Zentrum.' },
          { who: 'you', options: [
            { es: '¿Está lejos?', de: 'Ist es weit?', ok: true },
            { es: '¿Habla usted inglés?', de: 'Sprechen Sie Englisch?', ok: false, why: 'Du hast ihn verstanden! Frag lieber, ob es weit ist.' },
          ] },
          { who: 'npc', name: 'Chico', es: 'No, está cerca. Cinco minutos.', de: 'Nein, es ist nah. Fünf Minuten.' },
        ],
      },
      news: 'n10',
    },
    {
      id: 'u3l3',
      title: 'Links, rechts, geradeaus',
      goal: 'Du lernst, Wegbeschreibungen zu verstehen.',
      cando: 'Ich kann einfache Wegbeschreibungen verstehen.',
      situation: 'Weg fragen',
      items: [
        { id: 'a-la-izquierda', es: 'a la izquierda', de: 'links', emoji: '⬅️' },
        { id: 'a-la-derecha', es: 'a la derecha', de: 'rechts', emoji: '➡️' },
        { id: 'todo-recto', es: 'todo recto', de: 'geradeaus', emoji: '⬆️', alt: ['derecho'], note: 'In Mexiko: „derecho“' },
        { id: 'la-calle', es: 'la calle', de: 'die Straße', emoji: '🛣️' },
        { id: 'la-esquina', es: 'en la esquina', de: 'an der Ecke', emoji: '📐' },
        { id: 'gire', es: 'Gire a la derecha.', de: 'Biegen Sie rechts ab.', emoji: '↪️' },
        { id: 'siga', es: 'Siga todo recto.', de: 'Gehen Sie geradeaus weiter.', emoji: '🚶‍♀️' },
      ],
      tip: {
        title: 'Derecha ist nicht derecho',
        text: '„A la derecha“ heißt rechts. „Todo recto“ (in Mexiko „derecho“) heißt geradeaus. Wenn du unsicher bist, zeig einfach mit der Hand und frag: „¿Por aquí?“ – Hier entlang?',
      },
      scene: {
        title: 'Wo ist die Kathedrale?',
        intro: 'Eine Polizistin erklärt dir den Weg zur Kathedrale von Sevilla.',
        lines: [
          { who: 'npc', name: 'Policía', es: 'Siga todo recto y gire a la izquierda.', de: 'Gehen Sie geradeaus und biegen Sie links ab.' },
          { who: 'you', options: [
            { es: '¿Todo recto y a la izquierda?', de: 'Geradeaus und links?', ok: true },
            { es: '¿A la derecha?', de: 'Rechts?', ok: false, why: 'Sie hat „izquierda“ gesagt – das ist links.' },
          ] },
          { who: 'npc', name: 'Policía', es: 'Sí. La catedral está en la esquina.', de: 'Ja. Die Kathedrale ist an der Ecke.' },
          { who: 'you', options: [
            { es: 'Muchas gracias.', de: 'Vielen Dank.', ok: true },
            { es: '¿Dónde está la catedral?', de: 'Wo ist die Kathedrale?', ok: false, why: 'Das hat sie dir gerade erklärt!' },
          ] },
        ],
      },
      news: 'n11',
    },
    {
      id: 'u3l4',
      title: 'Sehenswürdigkeiten',
      goal: 'Du lernst, nach Öffnungszeiten und Eintritt zu fragen.',
      cando: 'Ich kann fragen, wann etwas geöffnet ist und was der Eintritt kostet.',
      situation: 'Sightseeing',
      items: [
        { id: 'abierto', es: 'abierto', de: 'geöffnet', emoji: '🟢' },
        { id: 'cerrado', es: 'cerrado', de: 'geschlossen', emoji: '🔴' },
        { id: 'esta-abierto', es: '¿Está abierto hoy?', de: 'Ist heute geöffnet?', emoji: '🚪' },
        { id: 'hoy', es: 'hoy', de: 'heute', emoji: '📅' },
        { id: 'manana', es: 'mañana', de: 'morgen', emoji: '🌄' },
        { id: 'una-entrada', es: 'una entrada', de: 'eine Eintrittskarte', emoji: '🎟️' },
        { id: 'dos-entradas', es: 'Dos entradas, por favor.', de: 'Zwei Eintrittskarten, bitte.', emoji: '🎟️' },
        { id: 'a-que-hora', es: '¿A qué hora abre?', de: 'Um wie viel Uhr öffnet es?', emoji: '⏰' },
      ],
      tip: {
        title: 'Siesta!',
        text: 'Viele kleine Läden in Spanien schließen mittags etwa von 14 bis 17 Uhr. Museen haben oft einen Ruhetag – meist Montag. Dafür ist abends bis 21 Uhr oder länger noch viel los.',
      },
      scene: {
        title: 'Am Alcázar',
        intro: 'Du stehst vor dem Königspalast Alcázar in Sevilla.',
        lines: [
          { who: 'you', options: [
            { es: 'Buenos días, ¿está abierto hoy?', de: 'Guten Morgen, ist heute geöffnet?', ok: true },
            { es: 'Buenos días, ¿está lejos?', de: 'Guten Morgen, ist es weit?', ok: false, why: 'Du stehst schon davor – frag, ob geöffnet ist.' },
          ] },
          { who: 'npc', name: 'Taquillera', es: 'Sí, está abierto.', de: 'Ja, es ist geöffnet.' },
          { who: 'you', options: [
            { es: 'Dos entradas, por favor.', de: 'Zwei Eintrittskarten, bitte.', ok: true },
            { es: 'Un café, por favor.', de: 'Einen Kaffee, bitte.', ok: false, why: 'An der Kasse kaufst du „entradas“.' },
          ] },
          { who: 'npc', name: 'Taquillera', es: 'Son veinte euros.', de: 'Das macht zwanzig Euro.' },
        ],
      },
      news: 'n12',
    },
  ],
  finale: {
    title: 'Verlaufen in der Altstadt',
    intro: 'Du hast dich im Viertel Santa Cruz verlaufen und willst zurück zum Hotel bei der Kathedrale.',
    lines: [
      { who: 'you', options: [
        { es: 'Disculpe, ¿dónde está la catedral?', de: 'Entschuldigung, wo ist die Kathedrale?', ok: true },
        { es: 'Disculpe, ¿hay una playa?', de: 'Entschuldigung, gibt es einen Strand?', ok: false, why: 'Du willst zur Kathedrale zurück.' },
      ] },
      { who: 'npc', name: 'Señora', es: 'Uy, está un poco lejos. Siga todo recto por esta calle.', de: 'Oh, das ist etwas weit. Gehen Sie diese Straße geradeaus.' },
      { who: 'you', options: [
        { es: 'Perdón, más despacio, por favor.', de: 'Verzeihung, langsamer, bitte.', ok: true },
        { es: 'Dos entradas, por favor.', de: 'Zwei Eintrittskarten, bitte.', ok: false, why: 'Wenn es zu schnell war: „Más despacio, por favor.“' },
      ] },
      { who: 'npc', name: 'Señora', es: 'Todo recto… y después a la derecha.', de: 'Geradeaus … und danach rechts.' },
      { who: 'you', options: [
        { es: 'Todo recto y a la derecha. ¿Está cerca?', de: 'Geradeaus und rechts. Ist es nah?', ok: true },
        { es: 'Todo recto y a la izquierda.', de: 'Geradeaus und links.', ok: false, why: 'Sie hat „derecha“ gesagt – rechts.' },
      ] },
      { who: 'npc', name: 'Señora', es: 'Sí, diez minutos.', de: 'Ja, zehn Minuten.' },
      { who: 'you', options: [
        { es: '¡Muchas gracias, señora!', de: 'Vielen Dank!', ok: true },
        { es: '¿Cuánto cuesta?', de: 'Wie viel kostet das?', ok: false, why: 'Eine Wegbeschreibung ist gratis 😊 – bedank dich.' },
      ] },
      { who: 'npc', name: 'Señora', es: 'De nada. ¡Que disfrute de Sevilla!', de: 'Gern geschehen. Genießen Sie Sevilla!' },
    ],
  },
};
