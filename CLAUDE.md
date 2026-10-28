# ¡Vamos! – Spanisch A1 für die Reise

Lern-App (PWA) für Antons Mutter (ca. 50, spricht kein Spanisch, iPhone X = max. iOS 16.7, Safari).
Ziel: in 15 Minuten pro Tag fit werden für Reisen in Spanien / Mexiko / Lateinamerika (A1).
Belohnung: edle Geschichts-Sammelkarten (Bronze/Silber/Gold). Kein Münzsystem.

Lies zuerst: `docs/SPEC.md` (was die App kann + Design), `docs/DATA.md` (Datenformate),
`docs/ROADMAP.md` (wer macht was).

## Harte Regeln
- **Tech:** reines HTML/CSS/JS (ES-Module), **kein Build-Schritt, keine npm-Laufzeit-Abhängigkeiten,
  keine CDNs** (offline-fähig). Läuft direkt von GitHub Pages unter Unterpfad `/vamos/` →
  **alle Pfade relativ** (`./…`), nie `/…`.
- **Ziel-Browser: iOS 16 Safari, Home-Bildschirm-Modus (standalone).** Keine Features nutzen, die dort
  fehlen: kein `SpeechRecognition` (geht in Home-Screen-Apps nicht), keine CSS-Nesting-Syntax,
  keine Container-Queries, kein `:has()` für Wichtiges, kein Top-Level-`await`.
  JS im Zweifel ES2020. `100dvh` nur mit `100vh`-Fallback; Safe-Area (`env(safe-area-inset-*)`)
  beachten (iPhone X hat Notch + Home-Balken).
- **UI-Sprache Deutsch**, Lerninhalte Spanisch. Mutter = weiblich → spanische Formen feminin
  (`encantada`, `alemana`, `cansada`).
- **Bedienbarkeit 50+:** Grundschrift ≥ 18 px, Buttons ≥ 52 px hoch, eine Aufgabe pro Bildschirm,
  immer klarer „Weiter“-Button, Icons nur mit Text, nichts Wichtiges nur per Wischgeste.
- **Echtheit:** Zeitungssätze (`data/news.js`) und Geschichtsfakten (`data/cards.js`) werden NUR von
  Anton/lokal mit Quelle gepflegt. **Niemals selbst Zeitungssätze oder Fakten erfinden oder ändern.**
  Einträge mit `placeholder: true` sind Platzhalter und dürfen in der UI angezeigt werden (für die
  Entwicklung), werden später ersetzt.
- `data/` gehört dem Inhalts-Team (lokal). Cloud-Sessions ändern dort nur Code-Dateien, wenn
  ausdrücklich gesagt — Inhalte nicht anfassen. Neue Felder? → in `docs/DATA.md` dokumentieren.
- Fortschritt in `localStorage` (Schlüssel `vamos.v1`), Schema-Version im Objekt; dazu
  `navigator.storage.persist()` versuchen. Nie Daten bei Update verlieren (Migrationen).
- Service Worker: Cache-Version in `sw.js` bei jeder Änderung hochzählen (`CACHE = 'vamos-vN'`).

## Befehle
- Lokal testen: `npx --yes http-server -p 8080 -c-1 .` → `http://localhost:8080/`
- Logik-Tests: `node --test tests/` (nur Node-Standard, keine Abhängigkeiten)
- Daten prüfen: `node tools/validate.mjs`

## Git
- Kleine Commits, **nach jedem Meilenstein `git push`** (Cloud-Guthaben kann jederzeit enden!).
- Commit-Identität ist eingerichtet (noreply). Repo öffentlich: keine persönlichen Daten, keine Namen
  außer „Mama“ in Texten.
