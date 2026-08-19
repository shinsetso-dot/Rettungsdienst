# Rettungsdienst-Toolkit — PWA

Offline-fähige Progressive Web App. Medikamente, Pädiatrie, EKG, Algorithmen
(DA/DI + Hessen getrennt), MANV, Metronom.

## Lokal starten

```bash
npm install
npm run dev
```

## Für GitHub Pages / echten Build

```bash
npm install
npm run build
```

Das Ergebnis liegt danach in `dist/` — das ist die fertige, statische App
(HTML/CSS/JS + alle Bilder). Diesen Ordner kannst du:

- direkt auf GitHub Pages hochladen (Branch `gh-pages` oder Ordner `/docs`)
- auf jeden anderen statischen Hoster legen (Netlify, Vercel, eigener Server)
- **auf dem Smartphone öffnen und über "Zum Startbildschirm hinzufügen"
  installieren** — das ist der PWA-Teil. Danach läuft die App wie eine
  echte App, auch offline.

## Wichtig zur Offline-Fähigkeit

- Der Service Worker (`public/sw.js`) cacht beim ersten Laden **alle** 66
  Algorithmus-Bilder (34 DA/DI + 32 Hessen) sowie App-Shell und Icons.
- Danach funktioniert die komplette App ohne Internetverbindung, auch im
  Flugmodus — das haben wir bewusst mit "Cache First" umgesetzt, nicht mit
  "Network First", damit nichts von einer schlechten Verbindung abhängt.
- **Achtung:** Der Service Worker funktioniert nur über HTTPS (oder
  `localhost` beim Testen). Das ist eine Browser-Vorgabe, keine
  Einschränkung von uns — GitHub Pages liefert automatisch HTTPS.
- Wenn du den Bilderordner oder Dateinamen änderst, muss `public/sw.js`
  händisch mit angepasst werden (die Bilderliste ist dort statisch
  eingetragen, nicht automatisch generiert).
- Alle Pfade (Bilder, Icons, Manifest, Service-Worker-Registrierung) sind
  bewusst **relativ** gehalten (kein führender `/`), damit die App auch
  funktioniert, wenn sie nicht auf der Root-Domain liegt, sondern in einem
  Unterordner wie bei GitHub Pages (`https://name.github.io/repo/`).

## Deploy auf GitHub Pages — Unterordner-Falle

Läuft deine Seite unter `https://DEINNAME.github.io/DEINREPO/` (Standard
bei einem normalen Projekt-Repo), **musst du zusätzlich** in
`vite.config.js` die auskommentierte Zeile aktivieren:

```js
base: "/DEINREPO/",
```

— exakt der Repo-Name, mit Schrägstrichen davor und danach. Ohne das lädt
zwar die Seite, aber das JS-Bundle selbst (nicht die Bilder — die sind ja
relativ) wird an der falschen Stelle gesucht. Läuft die Seite auf einer
eigenen Domain oder direkt unter `DEINNAME.github.io` (User/Org-Pages),
bleibt die Zeile auskommentiert.

## Icons austauschen

`public/icons/*.png` sind aktuell **Platzhalter** (oranges Kreuz-Symbol im
App-Farbschema) — für die echte Veröffentlichung solltest du eigene Icons
reinlegen, in exakt denselben Maßen:

- `icon-192.png` / `icon-512.png` — normale Icons
- `icon-maskable-192.png` / `icon-maskable-512.png` — mit Sicherheitsabstand
  zum Rand (Android rundet/beschneidet diese Variante je nach Launcher)

## Struktur

```
public/
  manifest.json       ← App-Name, Icons, Vollbild-Verhalten
  sw.js                ← Service Worker (Offline-Cache)
  icons/                ← App-Icons (siehe oben)
  images/
    da-di/              ← 34 Original-SOP-Bilder Bergstraße/Darmstadt/DaDi/GG
    hessen/              ← 32 Original-SOP-Bilder Hessen-Landesalgorithmen
src/
  main.jsx             ← React-Einstiegspunkt
  App.jsx               ← Die komplette App (keine Base64-Bilder mehr drin)
  index.css              ← globale Styles
```

## Bekannte Einschränkungen (bewusst so gelassen, siehe Chat)

- Auth-Bildschirm (`AuthForm`) ist noch fest auf Dark-Theme-Farben verdrahtet,
  unabhängig vom Hell/Dunkel-Umschalter der Hauptapp.
- Kein Google-Fonts-Import mehr (siehe `src/index.css`) — bewusst entfernt,
  damit die App wirklich 100% offline bleibt. Fällt sauber auf
  System-Schriftart zurück.
