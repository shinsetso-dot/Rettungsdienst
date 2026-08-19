// Service Worker für 100% Offline-Betrieb.
// Cache-Strategie: "Cache First, Network Fallback" für alles Statische
// (App-Shell, Bilder, Icons) — nach dem ersten Laden funktioniert die App
// komplett ohne Internet/im Flugmodus.

const CACHE_NAME = "rd-toolkit-v2";

const APP_SHELL = [
  "index.html",
  "manifest.json",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-192.png",
  "icons/icon-maskable-512.png",
];

const BILDER_DA_DI = [
"images/da-di/K10_status-epilepticus.webp",
"images/da-di/K11_schlaganfall.webp",
"images/da-di/K12_cpr-erwachsene.webp",
"images/da-di/K13_cpr-kind.webp",
"images/da-di/K14_neugeborenes.webp",
"images/da-di/K15_post-reanimationsphase.webp",
"images/da-di/K16_starke-schmerzzustaende.webp",
"images/da-di/K16a_schmerz-abdominell.webp",
"images/da-di/K16b_schmerz-traumatisch.webp",
"images/da-di/K16c_schmerz-thorakal.webp",
"images/da-di/K17_starke-uebelkeit.webp",
"images/da-di/K18_sepsis.webp",
"images/da-di/K19a_co-vergiftung-ohne-spco.webp",
"images/da-di/K19b_co-vergiftung-mit-spco.webp",
"images/da-di/K1_akutes-koronarsyndrom.webp",
"images/da-di/K20_opioid-komplikationsmanagement.webp",
"images/da-di/K2_linksherzinsuffizienz-dyspnoe.webp",
"images/da-di/K3_bradykardie.webp",
"images/da-di/K4_hypertensiver-notfall.webp",
"images/da-di/K5_obstruktive-atemwege-erwachsene.webp",
"images/da-di/K6_obstruktive-atemwege-kind.webp",
"images/da-di/K7_extrapulmonale-atemwegsobstruktion.webp",
"images/da-di/K8_hypoglykaemie.webp",
"images/da-di/K9_anaphylaxie.webp",
"images/da-di/P1_io-zugang.webp",
"images/da-di/P2_cpap-niv.webp",
"images/da-di/P3_extraglottischer-atemweg.webp",
"images/da-di/P4_thoraxentlastungspunktion.webp",
"images/da-di/P5_sauerstoffgabe.webp",
"images/da-di/V1a_bleibt-vor-ort-welcher-fall.webp",
"images/da-di/V1b_bleibt-vor-ort-welche-bedingungen.webp",
"images/da-di/V2_isobar.webp",
"images/da-di/V3a_vorsichtung-prior.webp",
"images/da-di/V3b_vorsichtung-mstart.webp",
];

const BILDER_HESSEN = [
"images/hessen/K10_status-epilepticus.webp",
"images/hessen/K11_schlaganfall.webp",
"images/hessen/K12_cpr-erwachsene.webp",
"images/hessen/K13_cpr-kind.webp",
"images/hessen/K14_neugeborenes.webp",
"images/hessen/K15_post-reanimationsphase.webp",
"images/hessen/K16_starke-schmerzzustaende.webp",
"images/hessen/K16a_schmerz-abdominell.webp",
"images/hessen/K16b_schmerz-traumatisch.webp",
"images/hessen/K16c_schmerz-thorakal.webp",
"images/hessen/K17_starke-uebelkeit.webp",
"images/hessen/K18_sepsis.webp",
"images/hessen/K19_co-vergiftung.webp",
"images/hessen/K1_akutes-koronarsyndrom.webp",
"images/hessen/K2_linksherzinsuffizienz-dyspnoe.webp",
"images/hessen/K3_bradykardie.webp",
"images/hessen/K4_hypertensiver-notfall.webp",
"images/hessen/K5_obstruktive-atemwege-erwachsene.webp",
"images/hessen/K6_obstruktive-atemwege-kind.webp",
"images/hessen/K7_extrapulmonale-atemwegsobstruktion.webp",
"images/hessen/K8_hypoglykaemie.webp",
"images/hessen/K9_anaphylaxie.webp",
"images/hessen/P1_io-zugang.webp",
"images/hessen/P2_cpap.webp",
"images/hessen/P3_extraglottischer-atemweg.webp",
"images/hessen/P4_thoraxentlastungspunktion.webp",
"images/hessen/P5_sauerstoffgabe.webp",
"images/hessen/V1a_bleibt-vor-ort-welcher-fall.webp",
"images/hessen/V1b_bleibt-vor-ort-welche-bedingungen.webp",
"images/hessen/V2_isobar.webp",
"images/hessen/V3a_vorsichtung-prior.webp",
"images/hessen/V3b_vorsichtung-mstart.webp",
];

const ALLE_ASSETS = [...APP_SHELL, ...BILDER_DA_DI, ...BILDER_HESSEN];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ALLE_ASSETS))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Zwei unterschiedliche Strategien, je nach Ressourcentyp:
//
// 1) App-Code (HTML/JS/CSS) — "Network First": bei jedem Start wird ZUERST
//    versucht, den aktuellen Stand vom Server zu holen. Nur wenn das nicht
//    klappt (kein Internet), wird die zuletzt gecachte Version genutzt.
//    So kommen Updates automatisch an, sobald das Gerät online ist —
//    kein manuelles Cache-Löschen/Neuinstallieren mehr nötig.
//
// 2) Bilder/Icons — "Cache First": die ändern sich praktisch nie, deshalb
//    weiterhin sofort aus dem Cache (schnell, spart Datenvolumen), nur bei
//    echtem Cache-Miss wird nachgeladen.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  const istAppCode =
    event.request.mode === "navigate" ||
    url.pathname.endsWith(".html") ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith("manifest.json");

  if (istAppCode) {
    // Network First
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && response.type !== "opaque") {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return response;
        })
        .catch(() =>
          caches.match(event.request).then((cached) => {
            if (cached) return cached;
            if (event.request.mode === "navigate") return caches.match("index.html");
          })
        )
    );
    return;
  }

  // Cache First für Bilder/Icons/alles andere
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type === "opaque") {
            return response;
          }
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          return response;
        })
        .catch(() => {
          if (event.request.mode === "navigate") {
            return caches.match("index.html");
          }
        });
    })
  );
});
