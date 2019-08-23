import { HttpRequest, HttpResponse, Idea } from '@cents-ideas/types';
import { HttpStatusCodes } from '@cents-ideas/enums';

import makeIdea, { IdeaErrors } from './idea';
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
        status: HttpStatusCodes.Created,
        error: false
      };
      const actual: HttpResponse = await controller.create(request);
      expect(actual).toEqual(expected);
    });

    it('reports user errors', async () => {
      let fakeUseCases: IdeaUseCases = new IdeaUseCases(database, (_payload: Idea) => {
        throw Error('💥');
      });
      let fakeController: IdeaController = new IdeaController(fakeUseCases);
      const request: HttpRequest = { body: makeFakeIdea() };
      const expected: HttpResponse = {
        status: HttpStatusCodes.BadRequest,
        error: '💥',
        body: {}
      };
      const actual: HttpResponse = await fakeController.create(request);
      expect(actual).toEqual(expected);
    });

    it('recognizes wrong payload', async () => {
      const request: HttpRequest = { body: { ...makeFakeIdea(), title: '' } };
      const expected: HttpResponse = {
        status: HttpStatusCodes.BadRequest,
        error: IdeaErrors.TitleRequired,
        body: {}
      };
      const actual: HttpResponse = await controller.create(request);
      expect(actual).toEqual(expected);
    });
  });

  // FIXME other tests
});
