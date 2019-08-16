import { MongoClient, Db, InsertOneWriteOpResult } from 'mongodb';
import { Idea } from '@cents-ideas/types';

export class IdeaDatabase {
  private readonly DATABASE_NAME: string = 'development';
  private readonly COLLECTION_NAME: string = 'ideas';
  private readonly DATABASE_URL: string = 'mongodb://ideas-db:27017';

  private client: MongoClient = new MongoClient(this.DATABASE_URL, { useNewUrlParser: true });

  constructor() {
    this.client.connect();
  }

  public makeDatabase = async (): Promise<Db> => {
    if (!this.client.isConnected()) {
      await this.client.connect();
    }
    return this.client.db(this.DATABASE_NAME);
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
