import { auth } from "./firebase-config.js";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// --- STATE LISTENER ---
export function initAuthListener(callback) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("User is signed in:", user.email);
            localStorage.setItem('goldenbite_user', JSON.stringify({
                uid: user.uid,
                email: user.email,
                name: user.displayName || user.email.split('@')[0]
            }));
        } else {
            console.log("User is signed out");
            localStorage.removeItem('goldenbite_user');
        }
        if (callback) callback(user);
    });
}

// --- ACTIONS ---
export async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

export async function signupUser(email, password, name) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        return { success: true, user: userCredential.user };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

export async function logoutUser() {
    try {
        await signOut(auth);
        localStorage.removeItem('goldenbite_user');
        window.location.href = 'index.html'; // Redirect to home
    } catch (error) {
        console.error("Logout error:", error);
    }
}
