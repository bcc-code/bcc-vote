import 'mocha';
import { assert } from 'chai';
import { getAranoDBConfigFromFeathers }  from './setup-tests/test-set';
import { Direction, MigrateWithConfig, deleteDatabase, pullDownTestDataLocally, ArangoDBConfig} from "@bcc-code/arango-migrate";


describe('Add-hock tests - db migrations', async () => {

    it.skip('Apply migrations upwards', async () => {

        try {
            await deleteDatabase(getAranoDBConfigFromFeathers());
            await MigrateWithConfig(Direction.Up, getAranoDBConfigFromFeathers(), './src/db-migrations');
            assert.isOk('The migraiton works');
        } catch (error) {
            assert.fail('Migration did not import successfully');
        }
    });

    it.skip('Downgrade latest migration', async () => {

        try {
            await MigrateWithConfig(Direction.Down, getAranoDBConfigFromFeathers(), './src/db-migrations');
            assert.isOk('The migraiton works');
        } catch (error) {
            assert.fail('Migration did not import successfully');
        }
    });

    it.skip('Import test data', async () => {

        const password = process.env.VOTE_ARANGODB_PASSWORD ?? "";
        const username = process.env.VOTE_ARANGODB_USERNAME ?? "";
        const url = process.env.VOTE_ARANGODB_URL ?? "";
        const databaseName = process.env.VOTE_ARANGODB_DATABASE ?? "";

        try {
            const config:ArangoDBConfig = {
                databaseName,
                url,
                auth: {
                    password,
                    username
                },
                testDataPath:'.\\test\\setup-tests\\test_data'
            };

            await pullDownTestDataLocally(config);
            assert.isOk('Test data pulled down successfully');
        } catch (error) {
            assert.fail('There was a problem pulling down the test data');
        }
    });
});
