import 'mocha';
import { assert } from 'chai';
import socketio from '@feathersjs/socketio-client';
import io from 'socket.io-client';
import feathers from '@feathersjs/feathers';
import fs from 'fs';
import jwt from 'jwt-simple';
import {logger} from '../src/logger';
import { PollingEventAnswerBatch } from '../src/domain';

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
}

describe('load test', () => {
    const testingVariables = {
        pollingEventId:"1520133464",
        pollId:"poll/1520133563",
        answerId: "1655878423211"
    };

    let receivedAnswersTotal = 0;
    let connectedClients = 0;
    const numberOfConnections = 100;
    const hasBatching = true;
    it.skip('Perform a socket load test on an environment', function (done) {

        const connetionPromises:Promise<void>[] = [];
        const virtualUsers:VirtualUser[] = [];
        for (let i = 1; i <= numberOfConnections; i++) {
            const vu = createNewVirtualUser(i);
            virtualUsers.push(vu);
            connetionPromises.push(setupUser(vu));
        }

        Promise.all(connetionPromises).then(() => {
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
        await vu.client.service('polling-event').get(testingVariables.pollingEventId,{});
        vu.client.service('answer').on(hasBatching ? 'batched' : 'created',(result)=>{
            if(hasBatching) {
                const batch = result as PollingEventAnswerBatch;
                receivedAnswersTotal += batch.answers.length;
            } else {
                receivedAnswersTotal++;
            }
        });

        vu.client.on("disconnect", () => {
            logger.error(`[CLIENT ${vu.personId}] Disconnected`);
        });
        connectedClients ++;
        console.log("Connected clients:", connectedClients, "/", numberOfConnections);
    }

    function createNewVirtualUser(personId: number):VirtualUser {
        const host = "dev.vote.bcc.no";
        const protocol = "https";

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
            client
        };
    }

    let identicalStatusCount = 0;
    const maxStatusCount = 10;
    let previousReceivedAnswerTotal: number;
    function checkStatus(done: Mocha.Done) {
        const receivedAnswersExpectedTotal = numberOfConnections * numberOfConnections;
        console.log('Received answers:', receivedAnswersTotal,"/",receivedAnswersExpectedTotal);
        if(receivedAnswersTotal > receivedAnswersExpectedTotal) {
            assert.fail('Received more answers than expected');
        }
        if(receivedAnswersTotal === receivedAnswersExpectedTotal) done();

        if(receivedAnswersTotal === previousReceivedAnswerTotal) {
            identicalStatusCount++;
        } else {
            identicalStatusCount = 0;
        }
        previousReceivedAnswerTotal = receivedAnswersTotal;

        if(identicalStatusCount >= maxStatusCount) {
            assert.fail(`Received the same count of answers ${maxStatusCount} times`);
        }
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
