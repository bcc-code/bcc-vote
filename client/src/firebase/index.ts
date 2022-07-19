import firebase from 'firebase/app';
import config from './config.json';
import {AuthenticationResult} from '@feathersjs/authentication';
import 'firebase/auth';
import 'firebase/firestore';

type CollectionName = 'poll' | 'polling-event' | 'poll-result' | 'answer'
type ChangeTypes =  firebase.firestore.DocumentChangeType

export let firestore: undefined | firebase.firestore.Firestore;
export let collection: undefined | Record<CollectionName,firebase.firestore.CollectionReference>;

export const forEach = (changeTypes: ChangeTypes[], docSnapshot: firebase.firestore.QuerySnapshot, callback: (data:firebase.firestore.DocumentData) => void) => {
    docSnapshot.docChanges().forEach(change => {
        if (changeTypes.includes(change.type)) {
            const data = change.doc.data();
            callback(data);
        }
    });
}

export default async function initFirestore(authResult: AuthenticationResult) {
    try {
        const {firebaseAccessToken} = authResult;
        if(!firebaseAccessToken) {
            throw Error('No token for accessing firebase');
        }
        const app = firebase.initializeApp(config);
        const auth = app.auth();
        await auth.signInWithCustomToken(firebaseAccessToken);
        
        firestore = app.firestore();
        collection = {
            'answer': firestore.collection('answer'),
            'poll': firestore.collection('poll'),
            'poll-result': firestore.collection('poll-result'),
            'polling-event': firestore.collection('polling-event'),
        };
    } catch(err) {
        console.error(err);
    }
}
