import 'mocha';
import socketio from '@feathersjs/socketio-client';
import io from 'socket.io-client';
import feathers from '@feathersjs/feathers';
import fs from 'fs';
import jwt from 'jwt-simple';
import logger from '../src/logger';
import { AuthenticationRequest } from '@feathersjs/authentication';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { PollResultVisibility } from '../src/domain/Poll';
// -----------------------------------------------------------------------------------------
// NB!!! Before running this performance test you have to run
// npm run mocha-dev-in-cloud
// this will set the NODE_ENV to dev-in-cloud which will use the dev-in-cloud config file
// in the config file you will notice the performacnce test are reliying on hard coded data
// to be present
// -----------------------------------------------------------------------------------------

interface VirtualUser {
    personId: number
    client: feathers.Application
    token: string
}

const testingVariablesLocal = {
    pollingEventId:"84441",
    pollId:"poll/84588",
    answerId: "1655972543954",
    host: "localhost:4040",
    protocol: "http"
};
const testingVariablesDev = {
    pollingEventId:"1520133464",
    pollId:"poll/1524149878",
    answerId: "1657097392329",
    host: "dev.vote.bcc.no",
    protocol: "https"
};

describe.skip('load test', () => {
    const useLocal = true;
    const testingVariables = useLocal ? testingVariablesLocal : testingVariablesDev;

    let receivedAnswersTotal = 0;
    let connectedClients = 0;
    // Firestore has a limit setup for the amount of listeners per client:
    // https://firebase.google.com/docs/firestore/best-practices#realtime_updates
    const numberOfConnections = 99;
    const startupDate = Date.now();
    const removeListeners: (() => void)[] = [];

    afterEach(() => {
        removeListeners.forEach((unsubscribe) => unsubscribe());
    });

    it('Perform a socket load test on an environment', (done) => {
        const connectionPromises:Promise<void>[] = [];
        const virtualUsers:VirtualUser[] = [];
        for (let i = 1; i <= numberOfConnections; i++) {
            const vu = createNewVirtualUser(i);
            virtualUsers.push(vu);
            connectionPromises.push(setupUser(vu));
        }

        Promise.all(connectionPromises).then(() => {
            for(const vu of virtualUsers){
                runFlow(vu);
            }
            setInterval(checkStatus, 5000, done);
        });
    });

    async function runFlow(vu: VirtualUser) {
        const a = {
            _from: testingVariables.pollId,
            _to: `person/${vu.personId}`,
            answerId: testingVariables.answerId,
            pollingEventId: testingVariables.pollingEventId,
            visibility: "public",
        };
        try {
            await vu.client.service('answer').create(a,{});

        } catch(err) {
            logger.error(err.message);
            throw err;
        }
    }

    async function setupUser(vu: VirtualUser) {
        try {
            const authRequest: AuthenticationRequest= {
                strategy: 'jwt',
                accessToken: vu.token
            };
            const {firebaseAccessToken} = await vu.client.service('authentication').create(authRequest, {});
    
            if(firebaseAccessToken) {
                const app = await initFirestore(firebaseAccessToken, vu.personId);
            
                const answerCol = app.firestore().collection('answer');
                const answerQuery = answerCol.where('lastChanged', '>=', startupDate).where('visibility','==',PollResultVisibility.Public);
                const unsubscribeAnswer = answerQuery.onSnapshot(snap => {
                    snap.docChanges().forEach(change => {
                        if (change.type === 'added') {
                            receivedAnswersTotal++;
                        }
                    });
                });
                removeListeners.push(unsubscribeAnswer);
            }
    
            vu.client.on("disconnect", () => {
                logger.error(`[CLIENT ${vu.personId}] Disconnected`);
            });
            connectedClients ++;
            console.log("Connected clients:", connectedClients, "/", numberOfConnections);
        } catch(err) {
            logger.error(`[CLIENT ${vu.personId}] Failed to setup: ${err.message}`);
        }
    }

    async function initFirestore(token: string, personID:number) {
        const app = firebase.initializeApp({
            "apiKey": "AIzaSyDt48CpGQBSsZg-6SSLTmLHgSyDgLVLmzE",
            "authDomain": "bcc-vote.firebaseapp.com",
            "projectId": "bcc-vote",
            "storageBucket": "bcc-vote.appspot.com",
            "messagingSenderId": "720418204616",
            "appId": "1:720418204616:web:19533b48520a110f252efd"
        }, `firebase-for-${personID}`);
        const auth = app.auth();
        await auth.signInWithCustomToken(token);
        return app;
    }

    function createNewVirtualUser(personId: number):VirtualUser {
        const {host, protocol} = testingVariables;

        const url = `${protocol}://${host}`;
        const token = getNewAuth0Jwt(personId);
        const socket = io(url, {
            transports:["websocket", "polling"],
            extraHeaders: {
                'Authorization': `Bearer ${token}`
            }
        } as any);
        const client = feathers();

        client.configure(socketio(socket, {
            timeout: 400000
        }));
        return {
            personId,
            client,
            token
        };
    }

    function checkStatus(done: Mocha.Done) {
        const receivedAnswersExpectedTotal = numberOfConnections * numberOfConnections;
        console.log('Received answers:',receivedAnswersTotal,"/",receivedAnswersExpectedTotal);
        if(receivedAnswersTotal === receivedAnswersExpectedTotal) done();
    }
});


function getNewAuth0Jwt(personID = 54512) {
    const privateKey = fs.readFileSync('config/development-private.key').toString();

    const now = Date.now();

    const expires = now + 7 * 24 * 60 * 60 * 1000;
    const access_token = jwt.encode(
        {
            'https://login.bcc.no/claims/physicalLoginTimestamp': Date.now(),
            'https://login.bcc.no/claims/personId': personID,
            'https://members.bcc.no/app_metadata': {
                hasMembership: true,
                personId: personID,
            },
            iss: 'auth0-impersonation',
            sub: 'auth0|5e90e4a9acb4320bd72e9bde',
            aud: ['bcc.members'],
            iat: now,
            exp: expires,
            azp: 'mHD7Uto7xPmyo4nVA2okg6CJCxjCDQe3',
            scope: 'openid profile email members.mfa',
        },
        privateKey,
        'RS256'
    );
    return access_token;
}
