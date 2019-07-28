import { Db, InsertOneWriteOpResult } from 'mongodb';
import { MakeIdeasDatabase, InsertIdea } from './ideas-database.types';
import { databaseConfig } from '../config';

const makeIdeasDatabase: MakeIdeasDatabase = ({
  makeDatabase,
  makeUniqueId
}) => {
  const COLLECTION: string = databaseConfig.ideasCollection;

  const insertIdea: InsertIdea = async ({
    id: _id = makeUniqueId(),
    ...payload
  }) => {
    const database: Db = await makeDatabase();
    const result: InsertOneWriteOpResult = await database
      .collection(COLLECTION)
      .insertOne({ _id, ...payload });
    const { _id: id, ...inserted } = result.ops[0];
    return { id, ...inserted };
  };

  return Object.freeze({
    insertIdea
  });
};

export default makeIdeasDatabase;
