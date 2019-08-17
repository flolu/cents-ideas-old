import { Idea } from '@cents-ideas/types';
import { IdeaUseCases } from './idea-use-cases';
import { HttpRequest, HttpResponse } from '@cents-ideas/types';
import { HttpStatusCodes } from '@cents-ideas/utils';

export class IdeaController {
  constructor(private useCases: IdeaUseCases) {}

  public create = async (request: HttpRequest): Promise<HttpResponse<{ created?: Idea }>> => {
    try {
      const created: Idea = await this.useCases.add(request.body);
      return {
        status: HttpStatusCodes.CREATED,
        body: { created },
        error: false
      };
    } catch (error) {
      return {
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
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
        body: { found },
        error: false
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
        body: { found },
        error: false
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
