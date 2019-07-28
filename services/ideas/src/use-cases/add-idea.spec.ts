import { IdeasDatabase } from '../data-access/ideas-database.types';
import makeIdeasDatabase from '../data-access/ideas-database';
import { makeFakeIdeaDatabase } from '../test/idea-database.mock';
import { makeUniqueId } from '@cents-ideas/utils';
import { Idea } from '../idea/idea.types';
import makeFakeIdea from '../test/idea.mock';
import { AddIdea } from './add-idea.types';
import makeAddIdea from './add-idea';

describe('add idea', () => {
  let database: IdeasDatabase;

  beforeAll(() => {
    database = makeIdeasDatabase({
      makeDatabase: makeFakeIdeaDatabase,
      makeUniqueId
    });
  });

  it('inserts ideas in the database', async () => {
    const idea: Idea = makeFakeIdea();
    const add: AddIdea = makeAddIdea({ ideasDatabase: database });
    const inserted: Idea = await add(idea);
    expect(inserted).toEqual(idea);
  });
});
