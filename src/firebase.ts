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

    // 2. Gestion dynamique du chemin GitHub Pages pour éviter l'erreur 404
    // Si on est sur github.io, on ajoute le nom du dépôt, sinon on reste à la racine (localhost)
    const isGitHubPages = window.location.hostname.includes('github.io');
    const baseSubFolder = isGitHubPages ? '/chaud-devant-81afb/' : '/';
    const swPath = `${baseSubFolder}firebase-messaging-sw.js`;

    console.log("Tentative d'enregistrement du Service Worker sur :", swPath);

    // 3. Enregistrer le Service Worker avec le bon scope
    const registration = await navigator.serviceWorker.register(swPath, {
      scope: baseSubFolder
    });

    console.log('Service Worker Firebase enregistré avec succès ! Scope:', registration.scope);

    // 4. Initialiser le module de messagerie Firebase
    const messaging = getMessaging(app);

    // 5. Récupérer le Token de l'appareil
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_VAPID_KEY || '',
      serviceWorkerRegistration: registration // Associe le token au service worker enregistré
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
