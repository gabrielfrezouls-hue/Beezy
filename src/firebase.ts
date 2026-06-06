import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken } from "firebase/messaging";

// Configuration de votre projet Firebase "Chaud devant"
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "chaud-devant-81afb.firebaseapp.com",
  projectId: "chaud-devant-81afb",
  storageBucket: "chaud-devant-81afb.firebasestorage.app",
  messagingSenderId: "336348032772",
  appId: "1:336348032772:web:0a92a5c11df89f8b2e6a51"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);

// Services Firebase exportés pour le reste de l'application
export const auth = getAuth(app);
export const db = getFirestore(app);

// Configuration des fournisseurs d'authentification Google
export const googleProvider = new GoogleAuthProvider();

export const googleCalendarProvider = new GoogleAuthProvider();
googleCalendarProvider.addScope('https://www.googleapis.com/auth/calendar.events');

// Identifiant Client Google
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

/**
 * Fonction pour demander l'autorisation des notifications et enregistrer le Service Worker
 */
export const activerNotifications = async () => {
  try {
    // 1. Demander la permission d'afficher des notifications
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Permission de notification refusée par l\'utilisateur.');
      return;
    }

    // 2. Gestion dynamique du sous-dossier GitHub Pages ('/Beezy/')
    // Permet de fonctionner à la fois en local (localhost) et en production sur votre dépôt Beezy
    const isGitHubPages = window.location.hostname.includes('github.io');
    const baseSubFolder = isGitHubPages ? '/Beezy/' : '/';
    const swPath = `${baseSubFolder}firebase-messaging-sw.js`;

    console.log("Tentative d'enregistrement du Service Worker Firebase sur :", swPath);

    // 3. Enregistrement manuel du Service Worker avec le bon scope
    const registration = await navigator.serviceWorker.register(swPath, {
      scope: baseSubFolder
    });

    console.log('Service Worker Firebase enregistré avec succès ! Scope:', registration.scope);

    // 4. Initialisation du module de messagerie (FCM)
    const messaging = getMessaging(app);

    // 5. Récupération du Token unique de l'appareil
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_VAPID_KEY || '',
      serviceWorkerRegistration: registration // Associe la clé de messagerie au worker configuré
    });

    if (token) {
      console.log('Token FCM récupéré avec succès :', token);
      // Astuce : C'est ici que vous pourrez ajouter le code pour enregistrer ce token dans Firestore
    } else {
      console.log('Aucun token disponible. Vérifiez la configuration de la clé VAPID.');
    }
  } catch (e) {
    console.error('Erreur lors de la configuration des notifications :', e);
  }
};
