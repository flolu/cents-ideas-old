import { MongoClient, Db, InsertOneWriteOpResult } from 'mongodb';

import { Idea } from '@cents-ideas/types';

import env from './environment';
const { logger } = env;
const loggerPrefix: string = 'database ->';

export class IdeaDatabase {
  private readonly COLLECTION_NAME: string = env.database.ideasCollectionName;

  private client: MongoClient = new MongoClient(this.url, { useNewUrlParser: true });

  constructor(private name: string = env.database.name, private url: string = env.database.url) {
    this.client.connect();
  }

  public makeDatabase = async (): Promise<Db> => {
    logger.info(loggerPrefix, 'create connection', this.name, this.url);
    if (!this.client.isConnected()) {
      logger.debug(loggerPrefix, 'not connected');
      await this.client.connect();
    }
    return this.client.db(this.name);
  };

  public closeConnection = async () => {
    await this.client.close();
    logger.info(loggerPrefix, 'closed connection', this.name, this.url);
  };

  public clearDatabase = async () => {
    await this.client
      .db(this.name)
      .collection(this.COLLECTION_NAME)
      .deleteMany({});
    logger.info(loggerPrefix, 'cleared', this.name, this.url);
    return true;
  };

  public insert = async ({ id: _id, ...payload }: Idea): Promise<Idea> => {
    logger.debug(loggerPrefix, 'insert', _id, 'into', this.name);
    const database: Db = await this.makeDatabase();
    const result: InsertOneWriteOpResult = await database
      .collection(this.COLLECTION_NAME)
      .insertOne({ _id, ...payload });
    const { _id: id, ...inserted } = result.ops[0];
    logger.debug(loggerPrefix, 'inserted', id, 'into', this.name);
    return { id, ...inserted };
  };

  public findById = async (id: string): Promise<Idea> => {
    logger.debug(loggerPrefix, 'find idea by id', id);
    const database: Db = await this.makeDatabase();
    const result = await database.collection(this.COLLECTION_NAME).findOne({ _id: id });
    logger.debug(loggerPrefix, 'found idea by id', id);
    return result;
  };

  public findAll = async (): Promise<Idea[]> => {
    logger.debug(loggerPrefix, 'find all ideas');
    const database: Db = await this.makeDatabase();
    const result = await database.collection(this.COLLECTION_NAME).find({});
    logger.debug(loggerPrefix, 'found all ideas');
    return result.toArray();
  };
}
