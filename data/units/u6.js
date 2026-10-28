export default {
  id: 'u6',
  title: 'Im Restaurant',
  titleEs: 'En el restaurante',
  place: 'Oaxaca',
  country: 'MX',
  emoji: '🌮',
  lessons: [
    {
      id: 'u6l1',
      title: 'Einen Tisch bekommen',
      goal: 'Du lernst, im Restaurant einen Tisch und die Speisekarte zu bekommen.',
      cando: 'Ich kann im Restaurant nach einem Tisch und der Speisekarte fragen.',
      situation: 'Restaurant',
      items: [
        { id: 'una-mesa', es: 'Una mesa para dos, por favor.', de: 'Einen Tisch für zwei, bitte.', emoji: '🍽️' },
        { id: 'la-carta', es: 'la carta', de: 'die Speisekarte', emoji: '📜', alt: ['el menú'] },
        { id: 'la-carta-por-favor', es: 'La carta, por favor.', de: 'Die Speisekarte, bitte.', emoji: '📜' },
        { id: 'en-la-terraza', es: 'en la terraza', de: 'auf der Terrasse', emoji: '🌿' },
        { id: 'dentro', es: 'dentro', de: 'drinnen', emoji: '🏠' },
        { id: 'para-beber', es: '¿Y para beber?', de: 'Und zu trinken?', emoji: '🥤' },
        { id: 'una-cerveza', es: 'una cerveza', de: 'ein Bier', emoji: '🍺' },
        { id: 'una-copa-de-vino', es: 'una copa de vino tinto', de: 'ein Glas Rotwein', emoji: '🍷' },
      ],
      tip: {
        title: 'Essenszeiten',
        text: 'In Spanien isst man mittags ab 14 Uhr und abends ab 21 Uhr – um 19 Uhr bist du oft allein. In Mexiko ist die „comida“ (Hauptmahlzeit) am Nachmittag, gegen 14–16 Uhr; abends isst man leichter.',
      },
      scene: {
        title: 'Am Eingang',
        intro: 'Du und eine Freundin wollt in Oaxaca zu Abend essen.',
        lines: [
          { who: 'npc', name: 'Mesero', es: 'Buenas noches, ¿cuántas personas?', de: 'Guten Abend, wie viele Personen?' },
          { who: 'you', options: [
            { es: 'Una mesa para dos, por favor.', de: 'Einen Tisch für zwei, bitte.', ok: true },
            { es: 'Tres noches, por favor.', de: 'Drei Nächte, bitte.', ok: false, why: 'Das wäre im Hotel. Hier: „Una mesa para dos.“' },
          ] },
          { who: 'npc', name: 'Mesero', es: '¿Dentro o en la terraza?', de: 'Drinnen oder auf der Terrasse?' },
          { who: 'you', options: [
            { es: 'En la terraza, por favor.', de: 'Auf der Terrasse, bitte.', ok: true },
            { es: 'A la izquierda.', de: 'Links.', ok: false, why: 'Er fragt: drinnen oder Terrasse?' },
          ] },
          { who: 'npc', name: 'Mesero', es: 'Aquí tienen la carta. ¿Y para beber?', de: 'Hier ist die Karte. Und zu trinken?' },
          { who: 'you', options: [
            { es: 'Una cerveza y un agua sin gas.', de: 'Ein Bier und ein stilles Wasser.', ok: true },
            { es: 'Una talla más grande.', de: 'Eine Nummer größer.', ok: false, why: 'Bestell etwas zu trinken.' },
          ] },
        ],
      },
      news: 'n21',
    },
    {
      id: 'u6l2',
      title: 'Was isst man?',
      goal: 'Du lernst Wörter, um eine Speisekarte zu verstehen.',
      cando: 'Ich kann die wichtigsten Wörter auf einer Speisekarte verstehen.',
      situation: 'Restaurant',
      items: [
        { id: 'el-pollo', es: 'el pollo', de: 'das Hähnchen', emoji: '🍗' },
        { id: 'la-carne', es: 'la carne', de: 'das Fleisch', emoji: '🥩' },
        { id: 'el-pescado', es: 'el pescado', de: 'der Fisch', emoji: '🐟' },
        { id: 'las-verduras', es: 'las verduras', de: 'das Gemüse', emoji: '🥦' },
        { id: 'el-arroz', es: 'el arroz', de: 'der Reis', emoji: '🍚' },
        { id: 'la-sopa', es: 'la sopa', de: 'die Suppe', emoji: '🍲' },
        { id: 'el-postre', es: 'el postre', de: 'der Nachtisch', emoji: '🍮' },
        { id: 'pica', es: '¿Pica?', de: 'Ist es scharf?', emoji: '🌶️', region: 'MX' },
        { id: 'que-me-recomienda', es: '¿Qué me recomienda?', de: 'Was empfehlen Sie mir?', emoji: '👨‍🍳' },
      ],
      tip: {
        title: '¿Pica? – die wichtigste Frage in Mexiko',
        text: '„¿Pica?“ heißt „Ist es scharf?“. Wenn der Kellner „poquito“ (ein bisschen) sagt, ist es für Deutsche oft schon sehr scharf! Sicher bist du mit „sin chile, por favor“.',
      },
      scene: {
        title: 'Die Bestellung',
        intro: 'Du schaust auf die Speisekarte und bist unsicher.',
        lines: [
          { who: 'you', options: [
            { es: 'Disculpe, ¿qué me recomienda?', de: 'Entschuldigung, was empfehlen Sie mir?', ok: true },
            { es: 'Disculpe, ¿dónde está el baño?', de: 'Entschuldigung, wo ist die Toilette?', ok: false, why: 'Du willst eine Empfehlung fürs Essen.' },
          ] },
          { who: 'npc', name: 'Mesero', es: 'El mole negro con pollo. Es la especialidad de Oaxaca.', de: 'Den schwarzen Mole mit Hähnchen. Das ist die Spezialität von Oaxaca.' },
          { who: 'you', options: [
            { es: '¿Pica?', de: 'Ist es scharf?', ok: true },
            { es: '¿Está abierto?', de: 'Ist geöffnet?', ok: false, why: 'Frag lieber, ob es scharf ist!' },
          ] },
          { who: 'npc', name: 'Mesero', es: 'No, no pica. Es un poco dulce.', de: 'Nein, nicht scharf. Es ist ein bisschen süß.' },
          { who: 'you', options: [
            { es: 'Perfecto, el mole con pollo, por favor.', de: 'Perfekt, den Mole mit Hähnchen, bitte.', ok: true },
            { es: 'No me gusta el pollo. Me lo llevo.', de: 'Ich mag kein Hähnchen. Ich nehme es.', ok: false, why: 'Das widerspricht sich 😉' },
          ] },
        ],
      },
      news: 'n22',
    },
    {
      id: 'u6l3',
      title: 'Allergien und Wünsche',
      goal: 'Du lernst, Allergien und besondere Wünsche zu sagen.',
      cando: 'Ich kann sagen, was ich nicht essen darf oder will.',
      situation: 'Restaurant',
      items: [
        { id: 'soy-alergica', es: 'Soy alérgica a los frutos secos.', de: 'Ich bin allergisch gegen Nüsse.', emoji: '🥜', note: 'Ein Mann: „alérgico“' },
        { id: 'soy-vegetariana', es: 'Soy vegetariana.', de: 'Ich bin Vegetarierin.', emoji: '🥗' },
        { id: 'sin-gluten', es: 'sin gluten', de: 'glutenfrei', emoji: '🌾' },
        { id: 'sin-picante', es: 'sin picante, por favor', de: 'nicht scharf, bitte', emoji: '🚫🌶️' },
        { id: 'lleva', es: '¿Lleva carne?', de: 'Ist da Fleisch drin?', emoji: '🔍' },
        { id: 'no-como', es: 'No como carne.', de: 'Ich esse kein Fleisch.', emoji: '🙅‍♀️' },
        { id: 'esta-muy-rico', es: '¡Está muy rico!', de: 'Es ist sehr lecker!', emoji: '😋' },
      ],
      tip: {
        title: '¿Lleva …? – Ist … drin?',
        text: 'Mit „¿Lleva …?“ fragst du, ob etwas in einem Gericht ist: „¿Lleva cebolla?“ (Zwiebeln), „¿Lleva leche?“ (Milch). „Rico“ heißt beim Essen nicht reich, sondern lecker!',
      },
      scene: {
        title: 'Vorsicht, Nüsse!',
        intro: 'Du hast eine Nussallergie und möchtest den Mole probieren.',
        lines: [
          { who: 'you', options: [
            { es: 'Soy alérgica a los frutos secos. ¿El mole lleva frutos secos?', de: 'Ich bin allergisch gegen Nüsse. Sind im Mole Nüsse?', ok: true },
            { es: 'Soy alemana. ¿Pica?', de: 'Ich bin Deutsche. Ist es scharf?', ok: false, why: 'Wichtig ist hier deine Allergie!' },
          ] },
          { who: 'npc', name: 'Mesera', es: 'Sí, lleva cacahuate y almendra. Le recomiendo la sopa de verduras.', de: 'Ja, da sind Erdnüsse und Mandeln drin. Ich empfehle Ihnen die Gemüsesuppe.' },
          { who: 'you', options: [
            { es: 'Muy bien, la sopa de verduras, por favor.', de: 'Sehr gut, die Gemüsesuppe, bitte.', ok: true },
            { es: 'Bueno, el mole, por favor.', de: 'Na gut, den Mole, bitte.', ok: false, why: 'Lieber nicht – im Mole sind Nüsse!' },
          ] },
          { who: 'note', de: 'Später …' },
          { who: 'npc', name: 'Mesera', es: '¿Qué tal la sopa?', de: 'Wie ist die Suppe?' },
          { who: 'you', options: [
            { es: '¡Está muy rica, gracias!', de: 'Sie ist sehr lecker, danke!', ok: true },
            { es: 'Es muy caro.', de: 'Es ist sehr teuer.', ok: false, why: 'Sie fragt, wie es schmeckt.' },
          ] },
        ],
      },
      news: 'n23',
    },
    {
      id: 'u6l4',
      title: 'Die Rechnung',
      goal: 'Du lernst, nach der Rechnung zu fragen und Trinkgeld zu geben.',
      cando: 'Ich kann die Rechnung verlangen, bezahlen und Trinkgeld geben.',
      situation: 'Restaurant',
      items: [
        { id: 'la-cuenta-por-favor', es: 'La cuenta, por favor.', de: 'Die Rechnung, bitte.', emoji: '🧾' },
        { id: 'la-propina', es: 'la propina', de: 'das Trinkgeld', emoji: '🪙' },
        { id: 'esta-incluida', es: '¿La propina está incluida?', de: 'Ist das Trinkgeld inklusive?', emoji: '❓' },
        { id: 'quedese-con-el-cambio', es: 'Quédese con el cambio.', de: 'Stimmt so. (Behalten Sie das Wechselgeld.)', emoji: '😊' },
        { id: 'juntos', es: 'juntos', de: 'zusammen', emoji: '👭' },
        { id: 'por-separado', es: 'por separado', de: 'getrennt', emoji: '➗' },
        { id: 'todo-muy-rico', es: 'Todo muy rico, gracias.', de: 'Alles sehr lecker, danke.', emoji: '🌟' },
      ],
      tip: {
        title: 'Trinkgeld: Mexiko ≠ Spanien',
        text: 'In Mexiko sind 10–15 % Trinkgeld üblich – die Kellner leben davon. In Spanien gibt man weniger: Man rundet auf oder lässt ein paar Münzen liegen. Die Rechnung kommt nie von allein – du musst danach fragen.',
      },
      scene: {
        title: 'Zahlen, bitte!',
        intro: 'Ihr habt fertig gegessen. Der Kellner kommt nicht von allein.',
        lines: [
          { who: 'you', options: [
            { es: 'Disculpe, la cuenta, por favor.', de: 'Entschuldigung, die Rechnung, bitte.', ok: true },
            { es: 'Disculpe, la carta, por favor.', de: 'Entschuldigung, die Speisekarte, bitte.', ok: false, why: 'Vorsicht: „carta“ = Speisekarte, „cuenta“ = Rechnung.' },
          ] },
          { who: 'npc', name: 'Mesero', es: '¿Juntos o por separado?', de: 'Zusammen oder getrennt?' },
          { who: 'you', options: [
            { es: 'Juntos, por favor. ¿La propina está incluida?', de: 'Zusammen, bitte. Ist das Trinkgeld inklusive?', ok: true },
            { es: 'Sin hielo, por favor.', de: 'Ohne Eis, bitte.', ok: false, why: 'Er fragt: zusammen oder getrennt?' },
          ] },
          { who: 'npc', name: 'Mesero', es: 'No, no está incluida. Son cuatrocientos cincuenta pesos.', de: 'Nein, nicht inklusive. Das macht 450 Pesos.' },
          { who: 'you', options: [
            { es: 'Aquí tiene quinientos. Quédese con el cambio.', de: 'Hier sind 500. Stimmt so.', ok: true },
            { es: 'Es muy caro. ¿Me hace un descuento?', de: 'Das ist sehr teuer. Geben Sie mir Rabatt?', ok: false, why: 'Im Restaurant handelt man nicht!' },
          ] },
          { who: 'npc', name: 'Mesero', es: '¡Muchas gracias! Vuelvan pronto.', de: 'Vielen Dank! Kommen Sie bald wieder.' },
        ],
      },
      news: 'n24',
    },
  ],
  finale: {
    title: 'Abendessen in Oaxaca',
    intro: 'Dein letzter Abend in Oaxaca – ein Restaurant mit Blick auf die Kirche Santo Domingo.',
    lines: [
      { who: 'npc', name: 'Mesera', es: 'Buenas noches, bienvenida. ¿Cuántas personas?', de: 'Guten Abend, willkommen. Wie viele Personen?' },
      { who: 'you', options: [
        { es: 'Una mesa para una persona, en la terraza, por favor.', de: 'Einen Tisch für eine Person, auf der Terrasse, bitte.', ok: true },
        { es: 'Tengo una reserva para tres noches.', de: 'Ich habe eine Reservierung für drei Nächte.', ok: false, why: 'Du bist im Restaurant, nicht im Hotel.' },
      ] },
      { who: 'npc', name: 'Mesera', es: 'Aquí tiene la carta. ¿Qué le traigo de beber?', de: 'Hier ist die Karte. Was bringe ich Ihnen zu trinken?' },
      { who: 'you', options: [
        { es: 'Una copa de vino tinto, por favor. ¿Qué me recomienda para comer?', de: 'Ein Glas Rotwein, bitte. Was empfehlen Sie zum Essen?', ok: true },
        { es: 'La cuenta, por favor.', de: 'Die Rechnung, bitte.', ok: false, why: 'Du hast noch nicht mal bestellt!' },
      ] },
      { who: 'npc', name: 'Mesera', es: 'Las tlayudas. Llevan frijoles, queso y carne.', de: 'Die Tlayudas. Da sind Bohnen, Käse und Fleisch drauf.' },
      { who: 'you', options: [
        { es: 'No como carne. ¿Hay tlayudas vegetarianas?', de: 'Ich esse kein Fleisch. Gibt es vegetarische Tlayudas?', ok: true },
        { es: 'No entiendo. Adiós.', de: 'Ich verstehe nicht. Tschüss.', ok: false, why: 'Du hast „carne“ verstanden – sag, dass du kein Fleisch isst (stell dir vor, du bist Vegetarierin).' },
      ] },
      { who: 'npc', name: 'Mesera', es: 'Sí, con verduras. ¿Picante?', de: 'Ja, mit Gemüse. Scharf?' },
      { who: 'you', options: [
        { es: 'Sin picante, por favor.', de: 'Nicht scharf, bitte.', ok: true },
        { es: 'Con hielo, por favor.', de: 'Mit Eis, bitte.', ok: false, why: 'Sie fragt, ob scharf.' },
      ] },
      { who: 'note', de: 'Nach dem Essen …' },
      { who: 'you', options: [
        { es: 'Todo muy rico, gracias. La cuenta, por favor.', de: 'Alles sehr lecker, danke. Die Rechnung, bitte.', ok: true },
        { es: 'La carta, por favor.', de: 'Die Speisekarte, bitte.', ok: false, why: 'Jetzt willst du zahlen: „la cuenta“.' },
      ] },
      { who: 'npc', name: 'Mesera', es: 'Son trescientos pesos.', de: 'Das macht 300 Pesos.' },
      { who: 'you', options: [
        { es: 'Aquí tiene trescientos cuarenta. Quédese con el cambio.', de: 'Hier sind 340. Stimmt so.', ok: true },
        { es: 'Por separado, por favor.', de: 'Getrennt, bitte.', ok: false, why: 'Du bist allein da 😉' },
      ] },
    ],
  },
};
