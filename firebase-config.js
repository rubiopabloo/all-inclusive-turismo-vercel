// Firebase Configuration - All Inclusive Turismo
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, OAuthProvider, signOut, onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, serverTimestamp, updateDoc } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-storage.js";
const firebaseConfig = {
    apiKey: "AIzaSyCinZvj1_Ea_8eljH0Wr8pA3irmLdM8hos",
    authDomain: "allinclusiveturismo.com",
    projectId: "all-inclusive-turismo-web",
    storageBucket: "all-inclusive-turismo-web.firebasestorage.app",
    messagingSenderId: "418240833161",
    appId: "1:418240833161:web:44350003d52d4d7b1c4858"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const appleProvider = new OAuthProvider('apple.com');
// User roles: 'usuario', 'agente', 'admin'

/**
 * Create a user document in Firestore with role
 */
async function createUserDocument(user, role = 'usuario', extraData = {}) {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
        await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || extraData.displayName || '',
            role: role,
            phone: extraData.phone || '',
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp()
        });
    } else {
        // Update last login
        await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
    }
}

/**
 * Get user role from Firestore
 */
async function getUserRole(uid) {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
        return userSnap.data().role;
    }
    return 'usuario';
}

/**
 * Register with email/password
 */
async function registerWithEmail(email, password, displayName, phone = '', role = 'usuario') {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: displayName });
        await createUserDocument(userCredential.user, role, { displayName, phone });
        return { success: true, user: userCredential.user };
    } catch (error) {
        return { success: false, error: getErrorMessage(error.code) };
    }
}

/**
 * Login with email/password
 */
async function loginWithEmail(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await createUserDocument(userCredential.user); // Updates lastLogin
        return { success: true, user: userCredential.user };
    } catch (error) {
        return { success: false, error: getErrorMessage(error.code) };
    }
}

/**
 * Login with Google
 */
async function loginWithGoogle() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        await createUserDocument(result.user);
        return { success: true, user: result.user };
    } catch (error) {
        return { success: false, error: getErrorMessage(error.code) };
    }
}

/**
 * Login with Facebook
 */
async function loginWithFacebook() {
    try {
        const result = await signInWithPopup(auth, facebookProvider);
        await createUserDocument(result.user);
        return { success: true, user: result.user };
    } catch (error) {
        return { success: false, error: getErrorMessage(error.code) };
    }
}

/**
 * Login with Apple
 */
async function loginWithApple() {
    try {
        const result = await signInWithPopup(auth, appleProvider);
        await createUserDocument(result.user);
        return { success: true, user: result.user };
    } catch (error) {
        return { success: false, error: getErrorMessage(error.code) };
    }
}

/**
 * Logout
 */
async function logout() {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Translate Firebase error codes to Spanish
 */
function getErrorMessage(code) {
    const errors = {
        'auth/email-already-in-use': 'Este correo electrónico ya está registrado.',
        'auth/invalid-email': 'El correo electrónico no es válido.',
        'auth/operation-not-allowed': 'El inicio de sesión no está habilitado.',
        'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
        'auth/user-disabled': 'Esta cuenta ha sido deshabilitada.',
        'auth/user-not-found': 'No existe una cuenta con este correo.',
        'auth/wrong-password': 'Contraseña incorrecta.',
        'auth/invalid-credential': 'Credenciales inválidas. Verificá tu email y contraseña.',
        'auth/too-many-requests': 'Demasiados intentos. Intentá de nuevo más tarde.',
        'auth/popup-closed-by-user': 'Se cerró la ventana de inicio de sesión.',
        'auth/network-request-failed': 'Error de red. Verificá tu conexión a internet.'
    };
    return errors[code] || 'Ocurrió un error. Intentá de nuevo.';
}

export { registerWithEmail, loginWithEmail, loginWithGoogle, loginWithFacebook, loginWithApple, logout, getUserRole, onAuthStateChanged };
