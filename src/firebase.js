
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBPGMSPlHCy8tuP9Gexd4kl9M_8bfUi0GM",
  authDomain: "jbd-app-01.firebaseapp.com",
  projectId: "jbd-app-01",
  storageBucket: "jbd-app-01.appspot.com",
  messagingSenderId: "563267441316",
  appId: "1:563267441316:web:016c68c4e446d55d574c31",
  measurementId: "G-7ZSXSN99VG"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
