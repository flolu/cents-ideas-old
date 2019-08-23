import { Idea } from '@cents-ideas/types';

import { IdeaDatabase } from './idea-database';

import env from './environment';
const { logger } = env;
const loggerPrefix: string = 'use-cases ->';

export class IdeaUseCases {
  // TODO type?
  constructor(private database: IdeaDatabase, private makeIdea: any) {}

  add = (payload: any): Promise<Idea> => {
    logger.debug(loggerPrefix, 'add');
    const idea: Idea = this.makeIdea(payload);
    return this.database.insert(idea);
  };

  getOne = (id: string): Promise<Idea> => {
    logger.debug(loggerPrefix, 'getOne');
    return this.database.findById(id);
  };

  getAll = (): Promise<Idea[]> => {
    logger.debug(loggerPrefix, 'getAll');
    return this.database.findAll();
  };
}
