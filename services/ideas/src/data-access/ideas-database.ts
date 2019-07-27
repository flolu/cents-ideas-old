import { InsertOneWriteOpResult, Db } from 'mongodb';
import { Idea, MakeUniqueId } from '../idea/idea.types';

export default class IdeasDatabase {
  readonly COLLECTION: string = 'ideas';

  private database: Db = this.makeDatabase();

  constructor(private makeDatabase: any, private makeId: MakeUniqueId) {}

  public async insert({
    id: _id = this.makeId(),
    ...payload
  }: Idea): Promise<Idea> {
    this.ensureDatabaseIsInitiated();
    const result: InsertOneWriteOpResult = await this.database
      .collection(this.COLLECTION)
      .insertOne({ _id, ...payload });
    const { _id: id, ...inserted } = result.ops[0];
    return { id, ...inserted };
  }

  private async ensureDatabaseIsInitiated(): Promise<any> {
    try {
      if (!this.database) {
        this.database = await this.makeDatabase();
        return;
      }
      return;
    } catch (error) {
      throw new Error(`Connection to ideas database couldn't be established`);
    }
  }
}
