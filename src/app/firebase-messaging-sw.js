importScripts('https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.17.2/firebase-messaging.js');

// Inicializar Firebase en el Service Worker
firebase.initializeApp({
  apiKey: "AIzaSyAZIg-y-90SB09O9KbJBsbwsshXW1puV_k",
  authDomain: "petshop-e0c28.firebaseapp.com",
  projectId: "petshop-e0c28",
  storageBucket: "petshop-e0c28.firebasestorage.app",
  messagingSenderId: "33628475813",
  appId: "1:33628475813:web:a71681f2e43712aadb184c",
});

// Inicializar el servicio de mensajería
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('[firebase-messaging-sw.js] Mensaje recibido en segundo plano:', payload);

  const notificationTitle = payload.notification?.title || 'Notificación';
  const notificationOptions = {
    body: payload.notification?.body || 'Tienes una nueva notificación',
    icon: 'assets/icons/notification-icon.png',
    actions: [
      { action: 'accept', title: 'Aceptar' },
      { action: 'decline', title: 'Rechazar' },
    ],
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function (event) {
  if (event.action === 'accept') {
    console.log('Solicitud aceptada');
    // Realiza una acción como redirigir o llamar a la API
  } else if (event.action === 'decline') {
    console.log('Solicitud rechazada');
    // Lógica de rechazo
  } else {
    console.log('Notificación clicada');
  }
  event.notification.close();
});
