import Firestore from '@google-cloud/firestore';

export const db = new Firestore.Firestore({
    projectId: 'bcc-vote',
});

export const FieldValue = Firestore.FieldValue;
export const FieldPath = Firestore.FieldPath;
