export default {
  id: 'u8',
  title: 'Hilfe & Plaudern',
  titleEs: '¡Ayuda! y charlar',
  place: 'Cancún',
  country: 'MX',
  emoji: '🌴',
  lessons: [
    {
      id: 'u8l1',
      title: 'In der Apotheke',
      goal: 'Du lernst, in der Apotheke zu sagen, was dir fehlt.',
      cando: 'Ich kann in der Apotheke sagen, was mir weh tut, und etwas dagegen verlangen.',
      situation: 'Apotheke & Arzt',
      items: [
        { id: 'me-duele-la-cabeza', es: 'Me duele la cabeza.', de: 'Ich habe Kopfschmerzen.', emoji: '🤕' },
        { id: 'me-duele-el-estomago', es: 'Me duele el estómago.', de: 'Ich habe Bauchschmerzen.', emoji: '🤢' },
        { id: 'tengo-fiebre', es: 'Tengo fiebre.', de: 'Ich habe Fieber.', emoji: '🤒' },
        { id: 'estoy-resfriada', es: 'Estoy resfriada.', de: 'Ich bin erkältet.', emoji: '🤧', note: 'Ein Mann: „resfriado“' },
        { id: 'tiene-algo-para', es: '¿Tiene algo para el dolor de cabeza?', de: 'Haben Sie etwas gegen Kopfschmerzen?', emoji: '💊' },
        { id: 'protector-solar', es: 'el protector solar', de: 'die Sonnencreme', emoji: '🧴' },
        { id: 'cuantas-veces', es: '¿Cuántas veces al día?', de: 'Wie oft am Tag?', emoji: '🔢' },
      ],
      tip: {
        title: 'Me duele – es tut mir weh',
        text: '„Me duele …“ + Körperteil, schon weißt du dich zu helfen: la cabeza (Kopf), el estómago (Magen), la espalda (Rücken), el pie (Fuß). Spanische und mexikanische Apotheker beraten sehr gut.',
      },
      scene: {
        title: 'Zu viel Sonne',
        intro: 'Nach einem Tag am Strand hast du Kopfschmerzen.',
        lines: [
          { who: 'npc', name: 'Farmacéutico', es: 'Buenas tardes, ¿qué le pasa?', de: 'Guten Tag, was fehlt Ihnen?' },
          { who: 'you', options: [
            { es: 'Me duele la cabeza. ¿Tiene algo para el dolor de cabeza?', de: 'Ich habe Kopfschmerzen. Haben Sie etwas dagegen?', ok: true },
            { es: 'Me gusta la cabeza.', de: 'Mir gefällt der Kopf.', ok: false, why: '„Me gusta“ = gefällt mir; „me duele“ = tut mir weh.' },
          ] },
          { who: 'npc', name: 'Farmacéutico', es: '¿Tiene fiebre?', de: 'Haben Sie Fieber?' },
          { who: 'you', options: [
            { es: 'No, no tengo fiebre.', de: 'Nein, ich habe kein Fieber.', ok: true },
            { es: 'Sí, con hielo.', de: 'Ja, mit Eis.', ok: false, why: 'Er fragt nach Fieber.' },
          ] },
          { who: 'npc', name: 'Farmacéutico', es: 'Tome una pastilla con agua. Y beba mucha agua.', de: 'Nehmen Sie eine Tablette mit Wasser. Und trinken Sie viel Wasser.' },
          { who: 'you', options: [
            { es: '¿Cuántas veces al día?', de: 'Wie oft am Tag?', ok: true },
            { es: '¿Qué hora es?', de: 'Wie spät ist es?', ok: false, why: 'Frag lieber, wie oft du sie nehmen sollst.' },
          ] },
          { who: 'npc', name: 'Farmacéutico', es: 'Tres veces al día.', de: 'Dreimal am Tag.' },
        ],
      },
      news: 'n29',
    },
    {
      id: 'u8l2',
      title: 'Notfall',
      goal: 'Du lernst die Sätze, die du hoffentlich nie brauchst.',
      cando: 'Ich kann in einem Notfall um Hilfe rufen und das Wichtigste sagen.',
      situation: 'Notfall',
      items: [
        { id: 'ayuda', es: '¡Ayuda!', de: 'Hilfe!', emoji: '🆘' },
        { id: 'llame-a-un-medico', es: '¡Llame a un médico!', de: 'Rufen Sie einen Arzt!', emoji: '👩‍⚕️' },
        { id: 'llame-a-la-policia', es: '¡Llame a la policía!', de: 'Rufen Sie die Polizei!', emoji: '🚓' },
        { id: 'necesito-ayuda', es: 'Necesito ayuda.', de: 'Ich brauche Hilfe.', emoji: '🙏' },
        { id: 'me-han-robado', es: 'Me han robado el bolso.', de: 'Man hat mir die Handtasche gestohlen.', emoji: '👜' },
        { id: 'he-perdido', es: 'He perdido mi pasaporte.', de: 'Ich habe meinen Pass verloren.', emoji: '🛂' },
        { id: 'el-hospital', es: '¿Dónde está el hospital?', de: 'Wo ist das Krankenhaus?', emoji: '🏥' },
        { id: 'la-embajada', es: 'la embajada de Alemania', de: 'die deutsche Botschaft', emoji: '🇩🇪' },
      ],
      tip: {
        title: 'Die Nummer 112 und 911',
        text: 'In Spanien ist der Notruf 112 – wie bei uns. In Mexiko wählst du 911. Speichere vor der Reise auch die Nummer der deutschen Botschaft. Und: Ein Foto vom Reisepass auf dem Handy hilft enorm.',
      },
      scene: {
        title: 'Die Tasche ist weg',
        intro: 'Am Strand merkst du: Deine Tasche ist weg. Du gehst zu einem Polizisten.',
        lines: [
          { who: 'you', options: [
            { es: 'Disculpe, necesito ayuda. Me han robado el bolso.', de: 'Entschuldigung, ich brauche Hilfe. Man hat mir die Handtasche gestohlen.', ok: true },
            { es: 'Disculpe, ¿me hace un descuento?', de: 'Entschuldigung, geben Sie mir Rabatt?', ok: false, why: 'Sag, was passiert ist: „Me han robado el bolso.“' },
          ] },
          { who: 'npc', name: 'Policía', es: 'Lo siento. ¿Qué había en el bolso?', de: 'Das tut mir leid. Was war in der Tasche?' },
          { who: 'you', options: [
            { es: 'El pasaporte y la tarjeta.', de: 'Der Pass und die Karte.', ok: true },
            { es: 'Una mesa para dos.', de: 'Ein Tisch für zwei.', ok: false, why: 'Er fragt, was in der Tasche war.' },
          ] },
          { who: 'npc', name: 'Policía', es: 'Venga conmigo. Vamos a hacer una denuncia.', de: 'Kommen Sie mit. Wir machen eine Anzeige.' },
          { who: 'you', options: [
            { es: 'Gracias. Más despacio, por favor. Hablo un poco de español.', de: 'Danke. Langsamer, bitte. Ich spreche ein bisschen Spanisch.', ok: true },
            { es: 'Adiós.', de: 'Tschüss.', ok: false, why: 'Bleib und lass dir helfen!' },
          ] },
        ],
      },
      news: 'n30',
    },
    {
      id: 'u8l3',
      title: 'Das Wetter',
      goal: 'Du lernst, über das Wetter zu sprechen – das beste Smalltalk-Thema.',
      cando: 'Ich kann über das Wetter sprechen.',
      situation: 'Plaudern',
      items: [
        { id: 'hace-sol', es: 'Hace sol.', de: 'Die Sonne scheint.', emoji: '☀️' },
        { id: 'hace-calor-2', es: 'Hace calor.', de: 'Es ist heiß.', emoji: '🥵' },
        { id: 'hace-frio', es: 'Hace frío.', de: 'Es ist kalt.', emoji: '🥶' },
        { id: 'llueve', es: 'Llueve.', de: 'Es regnet.', emoji: '🌧️' },
        { id: 'hace-viento', es: 'Hace viento.', de: 'Es ist windig.', emoji: '💨' },
        { id: 'que-tiempo-hace', es: '¿Qué tiempo hace?', de: 'Wie ist das Wetter?', emoji: '🌤️' },
        { id: 'que-bonito', es: '¡Qué bonito!', de: 'Wie schön!', emoji: '🌺' },
        { id: 'el-mar', es: 'el mar', de: 'das Meer', emoji: '🌊' },
      ],
      tip: {
        title: 'Hace – es macht',
        text: 'Beim Wetter sagt man „hace“ (es macht): „hace sol, hace calor, hace frío“. Nur beim Regen nicht: „llueve“ (es regnet). Und „¡Qué bonito!“ passt zu fast allem, was dir gefällt.',
      },
      scene: {
        title: 'Am Strand',
        intro: 'Ein älterer Herr setzt sich neben dich an den Strand.',
        lines: [
          { who: 'npc', name: 'Señor', es: '¡Qué calor hace hoy!', de: 'Wie heiß es heute ist!' },
          { who: 'you', options: [
            { es: 'Sí, hace mucho calor. ¡Y el mar es muy bonito!', de: 'Ja, es ist sehr heiß. Und das Meer ist sehr schön!', ok: true },
            { es: 'Sí, hace frío.', de: 'Ja, es ist kalt.', ok: false, why: 'Er sagt, es ist heiß!' },
          ] },
          { who: 'npc', name: 'Señor', es: '¿Y en Alemania? ¿Qué tiempo hace ahora?', de: 'Und in Deutschland? Wie ist das Wetter jetzt?' },
          { who: 'you', options: [
            { es: 'En Alemania hace frío y llueve.', de: 'In Deutschland ist es kalt und es regnet.', ok: true },
            { es: 'En Alemania, me duele la cabeza.', de: 'In Deutschland tut mir der Kopf weh.', ok: false, why: 'Er fragt nach dem Wetter.' },
          ] },
          { who: 'npc', name: 'Señor', es: 'Ja, ja, ¡entonces quédese aquí en Cancún!', de: 'Haha, dann bleiben Sie doch hier in Cancún!' },
        ],
      },
      news: 'n31',
    },
    {
      id: 'u8l4',
      title: 'Über dich erzählen',
      goal: 'Du lernst, ein bisschen über dich und deine Familie zu erzählen.',
      cando: 'Ich kann ein kleines Gespräch über mich, meine Familie und meine Reise führen.',
      situation: 'Plaudern',
      items: [
        { id: 'tengo-hijos', es: 'Tengo dos hijos.', de: 'Ich habe zwei Kinder.', emoji: '👨‍👩‍👦‍👦' },
        { id: 'mi-hijo', es: 'mi hijo', de: 'mein Sohn', emoji: '👦' },
        { id: 'mi-familia', es: 'mi familia', de: 'meine Familie', emoji: '👪' },
        { id: 'estoy-de-vacaciones', es: 'Estoy de vacaciones.', de: 'Ich bin im Urlaub.', emoji: '🏝️' },
        { id: 'es-mi-primera-vez', es: 'Es mi primera vez en México.', de: 'Ich bin zum ersten Mal in Mexiko.', emoji: '🥇' },
        { id: 'me-encanta', es: 'Me encanta México.', de: 'Ich liebe Mexiko.', emoji: '❤️' },
        { id: 'aprendo-espanol', es: 'Aprendo español con una app.', de: 'Ich lerne Spanisch mit einer App.', emoji: '📱' },
        { id: 'hasta-pronto', es: '¡Hasta pronto!', de: 'Bis bald!', emoji: '👋' },
      ],
      tip: {
        title: 'Me encanta – noch mehr als me gusta',
        text: '„Me gusta“ heißt „gefällt mir“, „me encanta“ ist „ich liebe es“. Mexikaner freuen sich riesig, wenn du ihr Land lobst – ein „¡Me encanta México!“ bringt dir sofort Sympathien.',
      },
      scene: {
        title: 'Plaudern mit der Kellnerin',
        intro: 'Eine junge Kellnerin fragt dich neugierig aus.',
        lines: [
          { who: 'npc', name: 'Mesera', es: '¿Es su primera vez en México?', de: 'Sind Sie zum ersten Mal in Mexiko?' },
          { who: 'you', options: [
            { es: 'Sí, es mi primera vez. ¡Me encanta México!', de: 'Ja, zum ersten Mal. Ich liebe Mexiko!', ok: true },
            { es: 'No, no funciona.', de: 'Nein, es funktioniert nicht.', ok: false, why: 'Sie fragt, ob du zum ersten Mal hier bist.' },
          ] },
          { who: 'npc', name: 'Mesera', es: '¡Qué bien! Habla muy bien español.', de: 'Wie schön! Sie sprechen sehr gut Spanisch.' },
          { who: 'you', options: [
            { es: 'Gracias. Aprendo español con una app.', de: 'Danke. Ich lerne Spanisch mit einer App.', ok: true },
            { es: 'Lo siento.', de: 'Es tut mir leid.', ok: false, why: 'Sie macht dir ein Kompliment – freu dich!' },
          ] },
          { who: 'npc', name: 'Mesera', es: '¿Y viaja sola?', de: 'Und reisen Sie allein?' },
          { who: 'you', options: [
            { es: 'No, con mi familia. Tengo dos hijos.', de: 'Nein, mit meiner Familie. Ich habe zwei Kinder.', ok: true },
            { es: 'Tengo fiebre.', de: 'Ich habe Fieber.', ok: false, why: 'Erzähl lieber von deiner Familie.' },
          ] },
        ],
      },
      news: 'n32',
    },
  ],
  finale: {
    title: 'Abschied von Mexiko',
    intro: 'Letzter Abend. Im Hotelgarten kommst du mit Doña Carmen ins Gespräch.',
    lines: [
      { who: 'npc', name: 'Doña Carmen', es: 'Buenas noches. ¿Usted es de aquí?', de: 'Guten Abend. Sind Sie von hier?' },
      { who: 'you', options: [
        { es: 'Buenas noches. No, soy alemana. Me llamo {name}.', de: 'Guten Abend. Nein, ich bin Deutsche. Ich heiße {name}.', ok: true },
        { es: 'Buenos días. Sí, soy de Cancún.', de: 'Guten Morgen. Ja, ich bin aus Cancún.', ok: false, why: 'Es ist Abend, und du bist aus Deutschland.' },
      ] },
      { who: 'npc', name: 'Doña Carmen', es: 'Mucho gusto. Yo soy Carmen. ¿Está de vacaciones?', de: 'Sehr erfreut. Ich bin Carmen. Sind Sie im Urlaub?' },
      { who: 'you', options: [
        { es: 'Encantada. Sí, estoy de vacaciones. Mañana vuelvo a Alemania.', de: 'Freut mich. Ja, ich bin im Urlaub. Morgen fliege ich zurück nach Deutschland.', ok: true },
        { es: 'Me duele el estómago.', de: 'Ich habe Bauchschmerzen.', ok: false, why: 'Sie fragt, ob du im Urlaub bist.' },
      ] },
      { who: 'npc', name: 'Doña Carmen', es: '¿Y qué le gusta más de México?', de: 'Und was gefällt Ihnen am meisten an Mexiko?' },
      { who: 'you', options: [
        { es: 'Me encanta la comida y el mar. ¡Qué bonito!', de: 'Ich liebe das Essen und das Meer. Wie schön!', ok: true },
        { es: 'La cuenta, por favor.', de: 'Die Rechnung, bitte.', ok: false, why: 'Sie fragt, was dir gefällt.' },
      ] },
      { who: 'npc', name: 'Doña Carmen', es: 'Habla muy bien español. ¿Lo estudió mucho?', de: 'Sie sprechen sehr gut Spanisch. Haben Sie viel gelernt?' },
      { who: 'you', options: [
        { es: 'Gracias. Aprendo un poco cada día con una app.', de: 'Danke. Ich lerne jeden Tag ein bisschen mit einer App.', ok: true },
        { es: 'No entiendo. ¿Habla usted inglés?', de: 'Ich verstehe nicht. Sprechen Sie Englisch?', ok: false, why: 'Du hast alles verstanden – du kannst das! 💪' },
      ] },
      { who: 'npc', name: 'Doña Carmen', es: 'Pues, ¡felicidades! Vuelva pronto.', de: 'Na dann, herzlichen Glückwunsch! Kommen Sie bald wieder.' },
      { who: 'you', options: [
        { es: '¡Muchas gracias, Carmen! ¡Hasta pronto!', de: 'Vielen Dank, Carmen! Bis bald!', ok: true },
        { es: '¡Llame a la policía!', de: 'Rufen Sie die Polizei!', ok: false, why: '😄 Ganz ruhig – verabschiede dich herzlich.' },
      ] },
    ],
  },
};
