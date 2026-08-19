import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Kein PWA-Plugin nötig — der Service Worker liegt fertig in public/sw.js
// und wird von Vite unverändert mit in den Build kopiert.
//
// WICHTIG für GitHub Pages: Wenn deine Seite unter
// https://DEINNAME.github.io/DEINREPO/ läuft (Standard bei einem normalen
// Projekt-Repo, nicht bei einer Custom-Domain), MUSST du die Zeile unten
// aktivieren und "DEINREPO" durch deinen exakten Repo-Namen ersetzen —
// sonst werden nach dem Deploy alle Bilder/Skripte nicht gefunden (404).
// Läuft die Seite auf einer eigenen Domain oder unter DEINNAME.github.io
// direkt (User/Org-Pages-Repo), bleibt die Zeile auskommentiert.
export default defineConfig({
  // base: "/DEINREPO/",
  plugins: [react()],
  build: {
    outDir: "dist",
    assetsInlineLimit: 0, // Bilder als echte Dateien behalten, nicht wieder inlinen
  },
});
