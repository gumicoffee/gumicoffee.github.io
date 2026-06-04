const CACHE_NAME = "gumi-kasir-v2"; // Nama versi cache diubah ke v2 untuk memaksa update UI
const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "./logo.png", // Tambahkan logo.png agar bisa diload offline
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
  "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap",
  "https://cdn.jsdelivr.net/npm/chart.js" // Tambahkan chart.js ke cache
];

// 1. Install Service Worker dan Simpan Cache
self.addEventListener("install", event => {
  // Langsung aktifkan service worker baru tanpa menunggu
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

// 2. Fetch Data dari Cache atau Network
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Kembalikan file dari cache jika ada, jika tidak ambil dari internet (fetch)
      return response || fetch(event.request);
    })
  );
});

// 3. Aktivasi Service Worker dan Hapus Cache Lama (v1)
self.addEventListener("activate", event => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});