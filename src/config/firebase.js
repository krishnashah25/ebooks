import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Debug logging
console.log("ENV CHECK:", import.meta.env.VITE_FIREBASE_API_KEY);

console.log("Firebase config fields loaded:", {
  apiKey: firebaseConfig.apiKey ? "PRESENT" : "UNDEFINED/EMPTY",
  authDomain: firebaseConfig.authDomain ? "PRESENT" : "UNDEFINED/EMPTY",
  projectId: firebaseConfig.projectId ? "PRESENT" : "UNDEFINED/EMPTY",
  storageBucket: firebaseConfig.storageBucket ? "PRESENT" : "UNDEFINED/EMPTY",
  messagingSenderId: firebaseConfig.messagingSenderId ? "PRESENT" : "UNDEFINED/EMPTY",
  appId: firebaseConfig.appId ? "PRESENT" : "UNDEFINED/EMPTY"
});

let app = null;
let auth = null;
let db = null;
let storage = null;
let firebaseError = null;

try {
  const required = ["apiKey", "projectId", "authDomain", "appId"];
  const missing = required.filter(field => !firebaseConfig[field]);
  if (missing.length > 0) {
    throw new Error(`Missing required configuration fields: ${missing.join(", ")}`);
  }
  
  if (firebaseConfig.apiKey.trim() === "" || firebaseConfig.apiKey === "MY_FIREBASE_API_KEY") {
    throw new Error("Invalid or empty Firebase API Key. Please get a valid key from Firebase Console -> Project Settings.");
  }

  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} catch (error) {
  console.error("Firebase Initialization Failed:", error.message);
  firebaseError = error;
}

export { app, auth, db, storage, firebaseError };
export default app;
