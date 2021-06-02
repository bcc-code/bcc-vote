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
        headers: {}
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

  const testData = {
    scopedToLocalChurchSameAsLoggedInUser: async () => { return await  pollingEventSvc.get('504279890');},
    scopedToLocalChurchDifferentAsLoggedInUser: async () => { return await  pollingEventSvc.get('504306892');},
    scopedAgeOutsideOfLoggedInUserAge: async () => { return await  pollingEventSvc.get('504306978');},
    user: async () => { return await userSvc.get('178509735',{});},
    basePoll: async () => { 
      return await pollSvc.get('504310091');
    },
  };

  return testData;
}




export {
  generateFreshContext,
  getAranoDBConfigFromFeathers,
  pollingEventsTestSet
};

