// lib/scripts/firebaseClient.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// ✅ Get your config values from your Firebase console
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  // Optional: add other keys like messagingSenderId or storageBucket if you need them
};

// ✅ Initialize the app once
const app = initializeApp(firebaseConfig);

// ✅ Export the auth client to use on the client
export const auth = getAuth(app);
