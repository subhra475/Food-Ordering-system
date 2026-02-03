import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAIvtqr6W1niUP2mM9L3dHUBCyVLn2quqs",
    authDomain: "food-ordering-system-8a21a.firebaseapp.com",
    projectId: "food-ordering-system-8a21a",
    storageBucket: "food-ordering-system-8a21a.firebasestorage.app",
    messagingSenderId: "986577859956",
    appId: "1:986577859956:web:d4ed32dd57a2219d436821"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
