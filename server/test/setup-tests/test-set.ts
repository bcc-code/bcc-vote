import app from '../../src/app';
import { ArangoDBConfig } from '@bcc-code/arango-migrate';

function getAranoDBConfigFromFeathers():ArangoDBConfig {
    const arangoDBConfig = app.get("arangodDB");

    const config:ArangoDBConfig = {
        databaseName: arangoDBConfig.database,
        url: arangoDBConfig.url,
        auth: {
            password: arangoDBConfig.password,
            username: arangoDBConfig.username
        },
        migrationsPath:'./src/db-migrations',
        testDataPath:'.\\test\\setup-tests\\test_data'
    };

    return config;
}

async function generateFreshContext() {
    const userSvc = app.service('user') as any ;

    const loggedInUser = await userSvc.get('178509735',{});

    const context = {
        app:app,
        data:{},
        id:'',
        method:'',
        path:'',
        params:{
            data:{},
            query: {},
            route: {},
            connection: {
                provider: 'socketio',
                headers: {
                    host: "localhost:4040",
                    connection: "keep-alive",
                    pragma: "no-cache",
                    "cache-control": "no-cache",
                    "sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"91\", \"Chromium\";v=\"91\"",
                    accept: "*/*",
                    "sec-ch-ua-mobile": "?0",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36",
                    origin: "http://localhost:8080",
                    "sec-fetch-site": "same-site",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-dest": "empty",
                    referer: "http://localhost:8080/",
                    "accept-encoding": "gzip, deflate, br",
                    "accept-language": "en-US,en;q=0.9",
                    cookie: "connect.sid=s%3Af-0neIU5xP7ltIV_cQDr5m57RvYiPyn0.n7VKOEMMiJCQiJhyMvVNQIKUQSLZoT0vY4sjrKKResw; io=qTpW6DZyyxb__QrkAAAA",
                },
                user:loggedInUser
            },
            provider: 'socketio',
            headers: {},
            authenticated: true,
            user: loggedInUser
        }
    };

    const contextString:any = JSON.stringify(context);
    const contextFresh = JSON.parse(contextString);
    return context;
}

function pollingEventsTestSet(){
    const pollingEventSvc = app.service('polling-event') as any;
    const userSvc = app.service('user') as any ;
    const pollSvc = app.service('poll') as any ;
    const answerSvc = app.service('answer') as any ;

    const testData = {
        scopedToLocalChurchSameAsLoggedInUser: async () => { return await  pollingEventSvc.get('504279890');},
        scopedToLocalChurchDifferentAsLoggedInUser: async () => { return await  pollingEventSvc.get('504306892');},
        scopedAgeOutsideOfLoggedInUserAge: async () => { return await  pollingEventSvc.get('504306978');},
        scopedLoggedInUserIsCreatorOfEvent: async () => { return await  pollingEventSvc.get('504327598');},
        eventForAllOrgs: async () => { return await  pollingEventSvc.get('504327598');},
        user: async () => { return await userSvc.get('178509735',{});},
        basePoll: async () => {
            return await pollSvc.get('504310091');
        },
        anonymousAnswer: async () => {
            return await answerSvc.get('113343');
        },
        nonpublicAnswer: async () => {
            return await answerSvc.get('113280');
        },
        publicAnswer: async () => {
            return await answerSvc.get('113226');
        }
    };

    return testData;
}

function newEntitiesFunc(){

    let newValidPollingEvent = {
        title: "Årsmøte 2021 Oslo/Follo!!!!!!!!!!!!!",
        description: "Årlig møte med hele menigheten",
        type: "live_event",
        status: "not_started",
        startDateTime: "2021-06-11T11:00:00",
        creatorId: 12345,
        participantFilter: {
            org: "69",
            roles: "all",
            minAge: 0,
            maxAge: 100
        }
    };

    let newValidPoll = {
        title: "This poll has custom explanations. Nice, isn't it?",
        description: "",
        pollingEventId: "504279890",
        activeStatus: "not_started",
        resultVisibility: "public",
        answers: [{
            label: "Yes",
            explanation: "This means that you like having things explained",
            answerId: 1
        }, {
            label: "No",
            explanation: "This means that you don't like having things explained",
            answerId: 2
        }]
    };
    newValidPollingEvent = JSON.parse(JSON.stringify(newValidPollingEvent));
    newValidPoll = JSON.parse(JSON.stringify(newValidPoll));

    return { newValidPollingEvent, newValidPoll };
}

async function getFeahtersToken() {
    const testingVariables = app.get('testingSet');

    const token = await app.service('authentication').createAccessToken({
        sub: testingVariables.userId
    });
    return token;
}

export {
    generateFreshContext,
    getAranoDBConfigFromFeathers,
    pollingEventsTestSet,
    newEntitiesFunc,
    getFeahtersToken
};

