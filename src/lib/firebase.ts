import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import config from "../../firebase-applet-config.json";

const firebaseConfig = {
  apiKey: config.apiKey || "AIzaSyDSbMGTmMB5uhnAeKnvkSImdR23zYtxz38",
  authDomain: config.authDomain || "uday-jewellers.firebaseapp.com",
  projectId: config.projectId || "uday-jewellers",
  storageBucket: config.storageBucket || "uday-jewellers.firebasestorage.app",
  messagingSenderId: config.messagingSenderId || "37739635629",
  appId: config.appId || "1:37739635629:web:ef345615db5c9b346ff724"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app, config.firestoreDatabaseId || "(default)");

