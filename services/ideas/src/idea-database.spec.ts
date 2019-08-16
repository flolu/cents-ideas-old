import { Idea } from '@cents-ideas/types';
import makeFakeIdea from './test/idea.mock';
import { IdeaDatabase } from './idea-database';

describe('IdeaDatabase', () => {
  let database: IdeaDatabase;

  beforeAll(() => {
    const databaseName: string = (global as any).__MONGO_DB_NAME__;
    const databaseUrl: string = (global as any).__MONGO_URI__;
    database = new IdeaDatabase(databaseName, databaseUrl);
  });

  it('inserts an idea', async () => {
    const idea: Idea = makeFakeIdea();
    const inserted: Idea = await database.insert(idea);
    expect(inserted).toEqual(idea);
  });

  // TODO other tests
});
