import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getStorage, connectStorageEmulator } from 'firebase/storage'
import { getMessaging, onMessage } from 'firebase/messaging'

// Tvůj Firebase config - nahraď vlastními hodnotami
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAbSOdstuMQEySmRtb_9SMKqxJHmhbk0oE",
  authDomain: "finance-pod-kontrolou.firebaseapp.com",
  projectId: "finance-pod-kontrolou",
  storageBucket: "finance-pod-kontrolou.firebasestorage.app",
  messagingSenderId: "839958398366",
  appId: "1:839958398366:web:4f3c867c3643d3db7a028f",
  measurementId: "G-GDZZGPN4ME"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// Messaging pro notifikace
export const messaging = getMessaging(app)

// Naslouchání push notifikacím
onMessage(messaging, (payload) => {
  console.log('Message received: ', payload)
  // Zobrazit notifikaci
  new Notification(payload.notification?.title || 'Finance pod kontrolou', {
    body: payload.notification?.body || 'Nová zpráva',
    icon: '/pwa-192x192.png',
  })
})

export default app
