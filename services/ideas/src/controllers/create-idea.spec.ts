import { HttpResponse, HttpStatusCodes, HttpRequest } from '@cents-ideas/utils';
import { Idea } from '../idea/idea.types';
import makeFakeIdea from '../test/idea.mock';
import { AddIdea } from '../use-cases/add-idea.types';
import makeCreateIdea from './create-idea';
import { CreateIdea } from './create-idea.types';

describe('create idea controller', () => {
  it('successfully creates an idea', async () => {
    const addIdeaMock: AddIdea = async payload => makeFakeIdea(payload);
    const create: CreateIdea = makeCreateIdea({ addIdea: addIdeaMock });
    const idea: Idea = makeFakeIdea();
    const request: HttpRequest = { body: idea };
    const expected: HttpResponse = {
      body: { created: idea },
      statusCode: HttpStatusCodes.CREATED
    };
    const acutal: HttpResponse = await create(request);
    expect(acutal).toEqual(expected);
  });
});
