import 'mocha';
import { assert } from 'chai';
import socketio from '@feathersjs/socketio-client';
import io from 'socket.io-client';
import feathers from '@feathersjs/feathers';
import fs from 'fs';
import jwt from 'jwt-simple';
import logger from '../src/logger';
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

const testingVariablesLocal = {
    pollingEventId:"84441",
    pollId:"poll/84588",
    answerId: "1655972543954",
    host: "localhost:4040",
    protocol: "http"
};
const testingVariablesDev = {
    pollingEventId:"1520133464",
    pollId:"poll/1522979151",
    answerId: "1656672521383",
    host: "dev.vote.bcc.no",
    protocol: "https"
};

describe('load test', () => {
    const useLocal = false;
    const testingVariables = useLocal ? testingVariablesLocal : testingVariablesDev;

    let receivedAnswersTotal = 0;
    const receivedAnswersPerUser:{[personID:number]: {receivedCount: number, uniqueAnswers:number, answerIds: string[]}} = {
    };
    let connectedClients = 0;
    const numberOfConnections = 500;
    const hasBatching = true;
    it.only('Perform a socket load test on an environment', function (done) {

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
        await vu.client.service('polling-event').get(testingVariables.pollingEventId,{});
        vu.client.service('answer').on(hasBatching ? 'batched' : 'created',(result)=>{
            if(hasBatching) {
                const batch = result as PollingEventAnswerBatch;
                if(batch.pollingEventId === testingVariables.pollingEventId) {
                    const answerIds = batch.answers.map(a => a._id);
                    if(receivedAnswersPerUser[vu.personId]) {
                        receivedAnswersPerUser[vu.personId].receivedCount += batch.answers.length;

                        if(receivedAnswersPerUser[vu.personId].answerIds.length) {
                            const filteredAnswerIds = answerIds.filter(a => receivedAnswersPerUser[vu.personId].answerIds.includes(a) === false);
                            receivedAnswersPerUser[vu.personId].answerIds.push(...filteredAnswerIds);
                        } else {
                            receivedAnswersPerUser[vu.personId].answerIds = answerIds;
                        }
                        
                        receivedAnswersPerUser[vu.personId].uniqueAnswers = receivedAnswersPerUser[vu.personId].answerIds.length;
                    } else {
                        receivedAnswersPerUser[vu.personId] = { receivedCount: batch.answers.length, answerIds, uniqueAnswers: answerIds.length};
                    }
                    receivedAnswersTotal += batch.answers.length;
                }
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
            client
        };
    }

    let identicalStatusCount = 0;
    const maxStatusCount = 10;
    let previousReceivedAnswerTotal: number;
    function checkStatus(done: Mocha.Done) {
        const receivedAnswersExpectedTotal = numberOfConnections * numberOfConnections;

        let receivedUniqueAnswersTotal = 0;
        Object.values(receivedAnswersPerUser).forEach(u => receivedUniqueAnswersTotal += u.uniqueAnswers);
        
        console.log('Received answers:', receivedUniqueAnswersTotal,"/",receivedAnswersExpectedTotal);
        if(receivedUniqueAnswersTotal >= receivedAnswersExpectedTotal) {
            console.table(receivedAnswersPerUser);
            done();
        }

        if(receivedAnswersTotal === previousReceivedAnswerTotal) {
            identicalStatusCount++;
        } else {
            identicalStatusCount = 0;
        }
        previousReceivedAnswerTotal = receivedAnswersTotal;

        if(identicalStatusCount >= maxStatusCount) {
            console.table(receivedAnswersPerUser);
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
