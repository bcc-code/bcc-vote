import { IOptions, AUTH_TYPES } from "@bcc-code/feathers-arangodb";
import { Application } from "../declarations";

export default function (app: Application) {
  const arangoDBConfig = app.get("arangodDB");
  const answerDatabase: IOptions = {
    collection: "answer",
    dbConfig: {
      url: arangoDBConfig.url,
    },
    database: arangoDBConfig.database,
    authType: AUTH_TYPES.BASIC_AUTH,
    username: arangoDBConfig.username,
    password: arangoDBConfig.password
  };
  return answerDatabase;
}