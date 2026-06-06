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
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return;
    const messaging = getMessaging(app);
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_VAPID_KEY || ''
    });
    if (token) {
      console.log('Token FCM :', token);
    }
  } catch (e) {
    console.error('Erreur notifications :', e);
  }
};
