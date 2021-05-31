import { IOptions, AUTH_TYPES } from "@bcc-its/feathers-arangodb";
import { Application } from "../declarations";

export default function (app: Application) {
  const arangoDBConfig = app.get("arangodDB");
  const personDatabase: IOptions = {
    collection: "polling_event",
    dbConfig: {
      url: arangoDBConfig.url,
    },
    database: arangoDBConfig.database,
    authType: AUTH_TYPES.BASIC_AUTH,
    username: arangoDBConfig.username,
    password: arangoDBConfig.password
  };
  return personDatabase;
}