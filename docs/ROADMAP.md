# ROADMAP

Budget: **eine** Cloud-Session (Restguthaben ≈ 8 $). Alles andere lokal.

## Cloud-Session 1 – „erledige Session 1“: die komplette App (Code)
Arbeite die Liste **von oben nach unten** ab. Nach jedem Punkt: Tests grün → commit → **push**.
Wenn das Guthaben endet, muss der gepushte Stand lauffähig sein. Am Ende PR gegen `main`.
Inhalte in `data/` nicht ändern (Beispiel-Daten u1 + Platzhalter reichen zum Bauen).

1. Gerüst: `index.html`, `css/app.css` (Design-Tokens aus SPEC §6, Fonts aus `fonts/`), `js/app.js`
   (kleiner Hash-Router: `#/`, `#/lernen`, `#/route`, `#/saetze`, `#/sammlung`, `#/einstellungen`),
   untere Tab-Leiste mit Icon **+ Text** (Start, Route, Sätze, Sammlung), Safe-Area-Ränder.
2. `js/store.js`: Fortschritt laden/speichern/migrieren (Schema in DATA.md), `storage.persist()`,
   Sicherung als Code (Base64 von JSON) exportieren/importieren. Tests.
3. `js/srs.js` (Leitner) + `js/session.js` (Tagesplan: Wiederholung → nächste Lektion → Zeitungssatz →
   Karte; Fortsetzen nach Abbruch). Tests.
4. `js/exercises.js`: Aufgaben-Generator aus Items (6 Typen aus SPEC §3, Ablenker aus derselben +
   früheren Lektionen, deterministisch per Seed testbar) + Renderer je Typ. Tests für Generator.
5. `js/speech.js`: Vorlesen (Stimmenwahl, Tempo, langsam), Aufnahme/Wiedergabe (MediaRecorder,
   `audio/mp4`), sauberer Fallback. Kein SpeechRecognition.
6. Lektions-Ablauf komplett (Ziel → neue Wörter → Tipp → Übungen → Szene → „Echt jetzt!“ → Geschafft).
   Fortschrittsbalken oben, „Schließen“ jederzeit (fragt nicht, speichert einfach).
7. `js/cards.js`: Ziehen mit Regeln aus SPEC §4 (Tests!), Zieh-Animation, edles Karten-Design,
   Sammlung/Album mit Filter. Platzhalter-Bilder: eleganter Rahmen mit Epochen-Emoji, falls Bild fehlt.
8. Startseite (Begrüßung nach Uhrzeit, großer Knopf, Streak mit Joker), Route (Stationen + Stempel +
   Can-do-Liste + Wortzahl), Reise-Sätze (nach Situation, Suche, 🔊), Einstellungen.
9. Onboarding (3 Seiten + Home-Bildschirm-Anleitung, nur wenn nicht standalone).
10. PWA: `manifest.webmanifest` (name „¡Vamos!“, `display: standalone`, `start_url: './'`,
    `scope: './'`, Farben), `sw.js` (Cache-first für alles, Versionierung), iOS-Meta-Tags
    (`apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`, `apple-touch-icon`),
    Icon als SVG in `img/icon.svg` + PNG-Platzhalter (Anton/lokal rendert final).
11. `tools/validate.mjs`: prüft alle Daten gegen DATA.md (eindeutige ids, genau eine ok-Option, news-Ref
    existiert, Bilddatei existiert oder placeholder, Rarity-Werte …), Exit-Code ≠ 0 bei Fehler.
12. Feinschliff: Animationen, Töne (kurz, per WebAudio erzeugt, keine Dateien), Papel-picado bei Gold,
    `prefers-reduced-motion`.

## Lokal (Claude auf Antons PC, ohne Cloud-Guthaben)
- Inhalte: Einheiten u2–u8, ~32 echte Zeitungssätze 2026 mit Quelle, ~50 Geschichtskarten mit
  gemeinfreien Bildern (Wikimedia Commons), Fakten geprüft.
- PR prüfen/mergen, Test im Handy-Format (Chrome), App-Icons rendern, GitHub Pages, Link an Mama.
