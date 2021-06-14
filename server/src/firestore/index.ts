const Firestore = require('@google-cloud/firestore')

export const db = new Firestore({
    projectId: 'bcc-vote',
});