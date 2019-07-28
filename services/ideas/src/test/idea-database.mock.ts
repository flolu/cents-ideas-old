import { MongoClient, Db } from 'mongodb';
import { databaseConfig } from '../config';

const COLLECTION: string = databaseConfig.ideasCollection;
let connection: MongoClient, db: Db;

const makeFakeIdeaDatabase = async () => {
  const uri: string = (global as any).__MONGO_URI__;
  const name: string = (global as any).__MONGO_DB_NAME__;

  connection =
    connection ||
    (await MongoClient.connect(uri, {
      useNewUrlParser: true
    }));
  db = db || (await connection.db(name));

  return db;
};

const closeConnection = async () => {
  await connection.close();
};

const clearDatabase = async () => {
  await db.collection(COLLECTION).deleteMany({});
  return true;
};

export { makeFakeIdeaDatabase, closeConnection, clearDatabase };
