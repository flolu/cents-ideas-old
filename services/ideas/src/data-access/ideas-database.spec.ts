import makeIdeasDatabase from './ideas-database';
import { IdeasDatabase } from './ideas-database.types';
import { makeFakeIdeaDatabase } from '../test/idea-database.mock';
import { makeUniqueId } from '@cents-ideas/utils';
import { Idea } from '../idea/idea.types';
import makeFakeIdea from '../test/idea.mock';

describe('ideas database', () => {
  let ideasDatabase: IdeasDatabase;

  beforeEach(() => {
    ideasDatabase = makeIdeasDatabase({
      makeDatabase: makeFakeIdeaDatabase,
      makeUniqueId
    });
  });

  it('inserts an idea', async () => {
    const idea: Idea = makeFakeIdea();
    const inserted: Idea = await ideasDatabase.insertIdea(idea);
    return expect(inserted).toEqual(idea);
  });
});
