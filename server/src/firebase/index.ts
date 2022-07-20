import { initializeApp } from 'firebase-admin';

export const app = initializeApp({
    serviceAccountId: 'firebase-adminsdk-yclzv@bcc-vote.iam.gserviceaccount.com',
    projectId: 'bcc-vote',
    databaseURL: 'https://bcc-vote.firebaseio.com'
});
export const db = app.firestore();
export const auth = app.auth();