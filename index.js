const CACHE_NAME = 'my-cache-v1';

const CACHE_ASSETS = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/scripts.js',
  'assets/img/logo.png'
];

// Evento de instalación
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cache abierta.');
      return cache.addAll(CACHE_ASSETS);
    })
  );
});

// Evento de activación
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Desapilando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Evento de captura de solicitudes
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request).then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    })
  );
});

// Evento de push
self.addEventListener('push', (event) => {
  let data = {};

  if (event.data) {
    data = event.data.json();
  } else {
    data = { title: 'Notificación', body: '¡Nueva notificación!' };
  }

  const options = {
    body: data.body,
    icon: 'img/icon-192x192.png',
    badge: 'img/icon-192x192.jpg',
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Evento de clic en notificación
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      const alreadyOpen = clientList.some((client) => {
        return client.url === '/' && 'focus' in client;
      });

      if (alreadyOpen) {
        return clients.focus();
      } else {
        return clients.openWindow('/');
      }
    })
  );
});
