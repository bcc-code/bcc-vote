import firebase from 'firebase';
import {AuthenticationResult} from '@feathersjs/authentication';

export default async function initFirestore(authResult: AuthenticationResult) {
    try {
        const {firebaseAccessToken} = authResult;
        if(!firebaseAccessToken) {
            throw Error('No token for accessing firebase');
        }
        const config = {
            apiKey: "AIzaSyDt48CpGQBSsZg-6SSLTmLHgSyDgLVLmzE",
            authDomain: "bcc-vote.firebaseapp.com",
            projectId: "bcc-vote",
            storageBucket: "bcc-vote.appspot.com",
            messagingSenderId: "720418204616",
            appId: "1:720418204616:web:19533b48520a110f252efd",
            measurementId: "G-4KNVYNZ55W"
        };
        const app = firebase.initializeApp(config);
        console.log('initialized')
        const auth = app.auth();
        await auth.signInWithCustomToken(firebaseAccessToken);
        return app.firestore();
    } catch(err) {
        console.error(err);
    }
}
