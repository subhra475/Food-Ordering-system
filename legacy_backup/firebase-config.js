// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig = {
  apiKey: "AIzaSyAIvtqr6W1niUP2mM9L3dHUBCyVLn2quqs",
  authDomain: "food-ordering-system-8a21a.firebaseapp.com",
  projectId: "food-ordering-system-8a21a",
  storageBucket: "food-ordering-system-8a21a.firebasestorage.app",
  messagingSenderId: "986577859956",
  appId: "1:986577859956:web:d4ed32dd57a2219d436821"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
