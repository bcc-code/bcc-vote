import { initializeApp, credential } from 'firebase-admin';

export const app = initializeApp({
    credential: credential.cert('./serviceAccount.json'),
    projectId: 'bcc-vote',
});
export const db = app.firestore();
export const auth = app.auth();