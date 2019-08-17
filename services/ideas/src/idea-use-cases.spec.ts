import { Idea } from '@cents-ideas/types';
import makeIdea from './idea';
import { IdeaDatabase } from './idea-database';
import { IdeaUseCases } from './idea-use-cases';
import makeFakeIdea from './test/idea.mock';

describe('IdeaUseCases', () => {
  let database: IdeaDatabase;
  let useCases: IdeaUseCases;

  beforeAll(() => {
    const databaseName: string = (global as any).__MONGO_DB_NAME__;
    const databaseUrl: string = (global as any).__MONGO_URI__;
    database = new IdeaDatabase(databaseName, databaseUrl);
    useCases = new IdeaUseCases(database, makeIdea);
  });

  it('adds an idea to the database', async () => {
    const idea: Idea = makeFakeIdea();
    const inserted: Idea = await useCases.add(idea);
    expect(inserted).toEqual(idea);
  });

  // TODO other tests
});
