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

  it('finds ideas by id', async () => {
    const idea: Idea = makeFakeIdea();
    const inserted: Idea = await database.insert(idea);
    const found: Idea = await database.findById(inserted.id);
    expect(found).toEqual(idea);
  });

  it('finds all ideas', async () => {
    const idea1: Idea = makeFakeIdea();
    const idea2: Idea = makeFakeIdea();
    await database.insert(idea1);
    await database.insert(idea2);
    const found: Idea[] = await database.findAll();
    expect(found).toContainEqual(idea1);
    expect(found).toContainEqual(idea2);
  });

  it('clears the database', async () => {
    await database.insert(makeFakeIdea());
    await database.clearDatabase();
    const found = await database.findAll();
    expect(found.length).toEqual(0);
  });

  afterAll(async () => {
    await database.clearDatabase();
    await database.closeConnection();
  });
});
