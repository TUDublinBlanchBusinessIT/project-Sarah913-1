import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD-5Mr4zd1E3-isbKVo6ZU1RdKEHdnkmc0",
  authDomain: "giftlocker-f02c9.firebaseapp.com",
  projectId: "giftlocker-f02c9",
  storageBucket: "giftlocker-f02c9.firebasestorage.app",
  messagingSenderId: "201789152566",
  appId: "1:201789152566:web:32f49eed02b38e8702a797",
  measurementId: "G-HP0RV48V3Y"
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
