# ¡Vamos!

Spanisch A1 für die Reise – 15 Minuten am Tag, mit Geschichts-Sammelkarten.
Web-App (PWA) für das iPhone. Siehe `docs/SPEC.md`.

## Entwickeln
- Lokal starten: `npx --yes http-server -p 8080 -c-1 .` → <http://localhost:8080/>
- Tests: `npm test` (= `node --test tests/*.test.js`, nur Node-Standard)
- Daten prüfen: `node tools/validate.mjs`
- Nach jeder Änderung an Code/Daten: `CACHE` in `sw.js` hochzählen; neue Dateien in `CORE` eintragen
  (`validate.mjs` meldet fehlende).

## Aufbau
| Datei | Aufgabe |
|---|---|
| `js/app.js` | Hash-Router, Tab-Leiste, Service-Worker-Registrierung |
| `js/ctx.js` | gemeinsamer Zustand (`app.state`, Inhalte `C`) |
| `js/store.js` | Fortschritt laden/speichern/migrieren, Sicherungs-Code |
| `js/srs.js` | Leitner-Wiederholung |
| `js/session.js` | Tagesplan, Abschluss, Streak mit Joker |
| `js/exgen.js` / `js/exercises.js` | Übungs-Generator (testbar) / Darstellung der 6 Übungstypen |
| `js/scene.js`, `js/news.js` | Dialog-Szenen, „Echt jetzt!“-Zeitungssatz |
| `js/cards.js` | Karten-Ziehregeln (Seltenheit, Pity, Garantien) |
| `js/speech.js`, `js/sound.js` | Vorlesen, Aufnahme, WebAudio-Töne |
| `js/views/*` | Start, Lern-Player, Route, Sätze, Sammlung, Einstellungen, Onboarding |
