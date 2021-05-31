require('dotenv').config();
import { MigrateWithConfig, Direction } from "@bcc-code/arango-migrate"

const run = async () => {

  let config:any = {
    url: process.env.VOTE_ARANGODB_URL,
    databaseName: process.env.VOTE_ARANGODB_DATABASE,
    auth: {
        username: process.env.VOTE_ARANGODB_USERNAME,
        password: process.env.VOTE_ARANGODB_PASSWORD,
    },
    migrationsPath: './src/db-migrations'
}

  await MigrateWithConfig(Direction.Up, config, "./lib/db-migrations");
}
run()
