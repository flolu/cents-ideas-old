import * as faker from 'faker';

import { makeUniqueId } from '@cents-ideas/utils';
import { Idea } from '@cents-ideas/types';

const makeFakeIdea = (overrides: Partial<Idea> = {}): Idea => {
  const idea: Idea = {
    id: makeUniqueId(),
    userId: makeUniqueId(),
    title: faker.lorem.words(5),
    description: faker.lorem.paragraphs(3),
    createdAt: new Date().toUTCString(),
    updatedAt: new Date().toUTCString()
  };
  return { ...idea, ...overrides };
};

export default makeFakeIdea;
