import { MongoClient, Db, InsertOneWriteOpResult } from 'mongodb';
import { Idea } from '@cents-ideas/types';
import { env } from './environment';

export class IdeaDatabase {
  private readonly COLLECTION_NAME: string = env.database.ideasCollectionName;

  private client: MongoClient = new MongoClient(this.url, { useNewUrlParser: true });

  constructor(private name: string = env.database.name, private url: string = env.database.url) {
    this.client.connect();
  }

  public makeDatabase = async (): Promise<Db> => {
    if (!this.client.isConnected()) {
      await this.client.connect();
    }
    return this.client.db(this.name);
  };

  public closeConnection = async () => {
    await this.client.close();
  };

  public clearDatabase = async () => {
    await this.client
      .db(this.name)
      .collection(this.COLLECTION_NAME)
      .deleteMany({});
    return true;
  };

  public insert = async ({ id: _id, ...payload }: Idea): Promise<Idea> => {
    const database: Db = await this.makeDatabase();
    const result: InsertOneWriteOpResult = await database
      .collection(this.COLLECTION_NAME)
      .insertOne({ _id, ...payload });
    const { _id: id, ...inserted } = result.ops[0];
    return { id, ...inserted };
  };

  public findById = async (id: string): Promise<Idea> => {
    const database: Db = await this.makeDatabase();
    const result = await database.collection(this.COLLECTION_NAME).findOne({ _id: id });
    return result;
  };

  public findAll = async (): Promise<Idea[]> => {
    const database: Db = await this.makeDatabase();
    const result = await database.collection(this.COLLECTION_NAME).find({});
    return result.toArray();
  };
}
