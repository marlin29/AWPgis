// Importa el script de Firebase Messaging
importScripts('https://www.gstatic.com/firebasejs/9.17.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.17.1/firebase-messaging-compat.js');

// Configuración de Firebase (reemplaza con tus datos)
const firebaseConfig = {
  apiKey: "AIzaSyCLATOoJaHm1ik6fCWHJYAkPgIhMQ5B5O4",
  authDomain: "the-chill-spot-b94ae.firebaseapp.com",
  projectId: "the-chill-spot-b94ae",
  storageBucket: "the-chill-spot-b94ae.firebasestorage.app",
  messagingSenderId: "519997067329",
  appId: "1:519997067329:web:023cffe155db50c797f6c0",
  measurementId: "G-NS2XWVYFF2"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);

// Inicializa Firebase Messaging
const messaging = firebase.messaging();

// Manejo de notificaciones en segundo plano
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Mensaje recibido en segundo plano:', payload);

  // Personaliza la notificación
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  };

  // Muestra la notificación
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  console.log('Notificación clickeada:', event.notification);
  
  // Cierra la notificación al hacer clic
  event.notification.close();

  // Redirige a una URL específica
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Si ya hay una pestaña abierta con la URL, la enfoca
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }

      // Si no hay pestaña abierta, abre una nueva
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
