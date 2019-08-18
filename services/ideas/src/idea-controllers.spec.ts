import { HttpRequest, HttpResponse, Idea } from '@cents-ideas/types';
import { HttpStatusCodes } from '@cents-ideas/utils';
import makeIdea from './idea';
import { IdeaController } from './idea-controllers';
import { IdeaDatabase } from './idea-database';
import { IdeaUseCases } from './idea-use-cases';
import makeFakeIdea from './test/idea.mock';

describe('IdeaController', () => {
  let database: IdeaDatabase;
  let useCases: IdeaUseCases;
  let controller: IdeaController;

  beforeAll(() => {
    const databaseName: string = (global as any).__MONGO_DB_NAME__;
    const databaseUrl: string = (global as any).__MONGO_URI__;
    database = new IdeaDatabase(databaseName, databaseUrl);
    useCases = new IdeaUseCases(database, makeIdea);
    controller = new IdeaController(useCases);
  });

  afterAll(async () => {
    await database.clearDatabase();
    await database.closeConnection();
  });

  describe('create idea', () => {
    it('successfully creates an idea', async () => {
      const idea: Idea = makeFakeIdea();
      const request: HttpRequest = { body: idea };
      const expected: HttpResponse<{ created: Idea }> = {
        body: { created: idea },
        status: HttpStatusCodes.CREATED,
        error: false
      };
      const actual: HttpResponse = await controller.create(request);
      expect(actual).toEqual(expected);
    });
  });

  // TODO other tests
});
