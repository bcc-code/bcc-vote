import 'mocha'
import { assert } from 'chai';
import { getAranoDBConfigFromFeathers }  from './setup-tests/test-set'
import { Direction, MigrateWithConfig, deleteDatabase, pullDownTestDataLocally, ArangoDBConfig} from "@bcc-code/arango-migrate";


describe('Add-hock tests - db migrations', async () => {

  it.skip('Apply migrations upwards', async () => {

    try {
        await deleteDatabase(getAranoDBConfigFromFeathers())
        await MigrateWithConfig(Direction.Up, getAranoDBConfigFromFeathers(), './src/db-migrations');
        assert.isOk('The migraiton works')
    } catch (error) {
        assert.fail('Migration did not import successfully')
    }
  });

  it.skip('Downgrade latest migration', async () => {

    try {
        await MigrateWithConfig(Direction.Down, getAranoDBConfigFromFeathers(), './src/db-migrations');
        assert.isOk('The migraiton works')
    } catch (error) {
        assert.fail('Migration did not import successfully')
    }
  });

  it.skip('Import test data', async () => {

    try {
        let config:ArangoDBConfig = {
            databaseName: "VOTE_TEST_TEMPLATE",
            url: "http+ssl://fee1cf9d321a.arangodb.cloud:8529/",
            auth: {
                password: "root",
                username: "import_test_data"
            },
            testDataPath:'.\\test\\setup-tests\\test_data'
        }

        await pullDownTestDataLocally(config)
        assert.isOk('Test data pulled down successfully')
    } catch (error) {
        assert.fail('There was a problem pulling down the test data')
    }
  });
});
