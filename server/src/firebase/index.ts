import firebase, { initializeApp, credential } from 'firebase-admin';

export let app: firebase.app.App;
export let db: firebase.firestore.Firestore;
export let auth: firebase.auth.Auth;

export function initFirebase() {
    console.log('Initializing Firebase');
    const a = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS as string);
    app = initializeApp({
        credential: credential.cert(a),
    });
    db = app.firestore();
    auth = app.auth();
    console.log('Initialized Firebase');
}