import { initializeApp } from 'firebase-admin';

export const app = initializeApp({
    projectId: 'bcc-vote',
});
export const db = app.firestore();
export const auth = app.auth();