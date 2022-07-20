import firebase, { initializeApp, credential } from 'firebase-admin';

export let app: firebase.app.App;
export let db: firebase.firestore.Firestore;
export let auth: firebase.auth.Auth;

export function initFirebase() {
    if(!process.env.FIREBASE_SERVICE_ACCOUNT) return;

    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    app = initializeApp({
        credential: credential.cert(serviceAccount),
    });
    db = app.firestore();
    auth = app.auth();
}