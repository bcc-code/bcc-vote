import app from '../../src/app';
import { ArangoDBConfig } from '@bcc-code/arango-migrate'

function getAranoDBConfigFromFeathers():ArangoDBConfig {
    const arangoDBConfig = app.get("arangodDB")

    let config:ArangoDBConfig = {
        databaseName: arangoDBConfig.database,
        url: arangoDBConfig.url,
        auth: {
            password: arangoDBConfig.password,
            username: arangoDBConfig.username
        },
        migrationsPath:'./src/db-migrations',
        testDataPath:'.\\test\\setup-tests\\test_data'
    }

    return config
}

async function generateFreshContext() {
  const userSvc = app.service('person') as any ;

  let loggedInUser = await userSvc.get('178509735',{})

  let context = {
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
  }

  let contextString:any = JSON.stringify(context);
  let contextFresh = JSON.parse(contextString)
  return context;
}

// Please look at test scenario TESTING_SCENARIOS/346023223 for more details




export {
    generateFreshContext,
    getAranoDBConfigFromFeathers
}

