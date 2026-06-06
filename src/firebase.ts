import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "chaud-devant-81afb.firebaseapp.com",
  projectId: "chaud-devant-81afb",
  storageBucket: "chaud-devant-81afb.firebasestorage.app",
  messagingSenderId: "336348032772",
  appId: "1:336348032772:web:0a92a5c11df89f8b2e6a51"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();

export const googleCalendarProvider = new GoogleAuthProvider();
googleCalendarProvider.addScope('https://www.googleapis.com/auth/calendar.events');

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

export const activerNotifications = async () => {
  try {
    // 1. Demander la permission à l'utilisateur
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Permission de notification refusée.');
      return;
    }

    // 2. Enregistrer manuellement le Service Worker pour éviter l'erreur 404 sur GitHub Pages
    // Note : Assurez-vous d'avoir déplacé le fichier firebase-messaging-sw.js dans le dossier /public !
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope: '/'
    });

    console.log('Service Worker Firebase enregistré avec succès !');

    // 3. Initialiser le module de messagerie Firebase
    const messaging = getMessaging(app);

    // 4. Récupérer le Token de l'appareil en lui passant l'enregistrement du Service Worker
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_VAPID_KEY || '',
      serviceWorkerRegistration: registration // Ligne cruciale pour lier le fichier lié
    });

    if (token) {
      console.log('Token FCM récupéré avec succès :', token);
    } else {
      console.log('Aucun token disponible.');
    }
  } catch (e) {
    console.error('Erreur notifications :', e);
  }
};
