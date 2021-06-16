const Firestore = require('@google-cloud/firestore')

export const db = new Firestore({
    projectId: 'bcc-vote',
});

export const FieldValue = Firestore.FieldValue;
export const FieldPath = Firestore.FieldPath;