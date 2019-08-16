import { Idea } from '@cents-ideas/types';
import { IdeaUseCases } from './idea-use-cases';
import { HttpRequest, HttpResponse } from '@cents-ideas/types';

export class IdeaController {
  constructor(private useCases: IdeaUseCases) {}

  public create = async (request: HttpRequest): Promise<HttpResponse> => {
    try {
      const created: Idea = await this.useCases.add(request.body);
      return {
        status: 201,
        body: { created }
      };
    } catch (error) {
      return {
        status: 500,
        body: {},
        error: error.message
      };
    }
  };

  public getOne = async (request: HttpRequest): Promise<HttpResponse> => {
    try {
      const found: Idea = await this.useCases.getOne(request.params.id);
      return {
        status: 201,
        body: { found }
      };
    } catch (error) {
      return {
        status: 500,
        body: {},
        error: error.message
      };
    }
  };

  public getAll = async (_request: HttpRequest): Promise<HttpResponse> => {
    try {
      const found: Idea[] = await this.useCases.getAll();
      return {
        status: 201,
        body: { found }
      };
    } catch (error) {
      return {
        status: 500,
        body: {},
        error: error.message
      };
    }
  };
}
