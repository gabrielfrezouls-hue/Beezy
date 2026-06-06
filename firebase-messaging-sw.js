// Importer les scripts nécessaires pour Firebase en arrière-plan
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js');

// Collez ici la configuration que vous avez récupérée à l'Étape 2
const firebaseConfig = {
  apiKey: "AIzaSyAriVwG_AZyCb8bWCKEn9Jh-QWN_8g7kgI",
  authDomain: "chaud-devant-81afb.firebaseapp.com",
  projectId: "chaud-devant-81afb",
  storageBucket: "chaud-devant-81afb.appspot.com",
  messagingSenderId: "336348032772",
  appId: "1:336348032772:web:0a92a5c11df89f8b2e6a51"
};

// Initialiser Firebase
firebase.initializeApp(firebaseConfig);

// Récupérer le système de messagerie
const messaging = firebase.messaging();

// Gérer les notifications lorsque l'application est en arrière-plan
messaging.onBackgroundMessage((payload) => {
  console.log('Notification reçue en arrière-plan: ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png' // Optionnel : mettez le chemin vers votre icône
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
