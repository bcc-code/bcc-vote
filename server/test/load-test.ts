import 'mocha';
import socketio from '@feathersjs/socketio-client';
import io from 'socket.io-client';
import feathers from '@feathersjs/feathers';
import app from '../src/app';
import fs from 'fs';
import jwt from 'jwt-simple';
import logger from '../src/logger';

// -----------------------------------------------------------------------------------------
// NB!!! Before running this performance test you have to run
// npm run mocha-dev-in-cloud
// this will set the NODE_ENV to dev-in-cloud which will use the dev-in-cloud config file
// in the config file you will notice the performacnce test are reliying on hard coded data
// to be present
// -----------------------------------------------------------------------------------------

describe('load test', () => {
    const testingVariables = app.get('testingSet');
    const host = app.get('host');
    const protocol = app.get('protocol');
    let allAnswers = 0;
    let connectedClients = 0;
    const numberOfConnections = 600;
    it.skip('Perform a socket load test on an environment', async () => {


        const clientsPromises:Promise<feathers.Application<any>>[] = [];
        for (let i = 1; i <= numberOfConnections; i++) {
            clientsPromises.push(newFeathersClient(i));
            // console.log('new user added, personId:',personId);
        }

        const clients = await Promise.all(clientsPromises);
        for (let i = 1; i <= numberOfConnections; i++)  {
            runFlow(clients[i - 1], i);
        }

        while (true) {
            await sleep(5000);
            console.log('allAnswers:',allAnswers,"/",numberOfConnections*numberOfConnections);
            if(allAnswers === numberOfConnections*numberOfConnections) break;
        }
    });

    async function runFlow(client: feathers.Application<any>, personId: number) {


        const a = {
            _from: testingVariables.pollId,
            _to: `person/${personId}`,
            answerId: testingVariables.answerId,
            pollingEventId: testingVariables.pollingEventId,
            visibility: "public",
        };
        try {
            await client.service('answer').create(a,{});

        } catch(err) {
            logger.error(err.message);
            throw err;
        }
    }


    async function newFeathersClient(personId: number) {

        const url = `${protocol}://${host}`;
        const token = await getNewAuth0Jwt(personId);
        const socket = io(url, {
            transports:["websocket", "polling"],
            extraHeaders: {
                'Authorization': `bearer ${token}`
            }
        } as any);
        const membersClient = feathers();

        membersClient.configure(socketio(socket, {
            timeout: 400000
        }));
        await membersClient.service('polling-event').get(testingVariables.pollingEventId,{});
        membersClient.service('answer').on('created',(a:any)=>{
            // console.log(`[CLIENT ${personId}] Received answer ${a._id}`);
            allAnswers++;
        });

        membersClient.on("disconnect", () => {
            logger.error(`[CLIENT ${personId}] Disconnected`);
        });
        connectedClients ++;
        console.log("Connected clients:", connectedClients, "/", numberOfConnections);
        return membersClient;
    }

    async function sleep(msec:any) {
        return new Promise(resolve => setTimeout(resolve, msec));
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
