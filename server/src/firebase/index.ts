import { initializeApp, credential } from 'firebase-admin';

export const app = initializeApp({
    credential: credential.applicationDefault(),
    projectId: 'bcc-vote',
    databaseURL: 'https://bcc-vote.firebaseio.com'
});
export const db = app.firestore();
export const auth = app.auth();