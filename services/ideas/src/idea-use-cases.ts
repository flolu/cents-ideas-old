import { Idea } from '@cents-ideas/types';

import { IdeaDatabase } from './idea-database';

export class IdeaUseCases {
  constructor(private database: IdeaDatabase, private makeIdea: any) {}

  add = (payload: any): Promise<Idea> => {
    const idea: Idea = this.makeIdea(payload);
    return this.database.insert(idea);
  };

  getOne = (id: string): Promise<Idea> => {
    return this.database.findById(id);
  };

  getAll = (): Promise<Idea[]> => {
    return this.database.findAll();
  };
}
