import { Idea } from '@cents-ideas/types';
import { IdeaUseCases } from './idea-use-cases';
import { HttpRequest, HttpResponse } from '@cents-ideas/types';
import { HttpStatusCodes } from '@cents-ideas/enums';

import env from './environment';
const { logger } = env;
const loggerPrefix: string = 'controller ->';

export class IdeaController {
  constructor(private useCases: IdeaUseCases) {}

  // TODO type other controllers, too
  public create = async (request: HttpRequest): Promise<HttpResponse<{ created?: Idea }>> => {
    try {
      logger.debug(loggerPrefix, 'create', request);
      const created: Idea = await this.useCases.add(request.body);
      return {
        status: HttpStatusCodes.Created,
        body: { created },
        error: false
      };
    } catch (error) {
      // FIXME find a way to handle expected errors
      logger.error(loggerPrefix, 'error in create', error);
      return {
        status: HttpStatusCodes.BadRequest,
        body: {},
        error: error.message
      };
    }
  };
  // TODO handle not found
  public getOne = async (request: HttpRequest): Promise<HttpResponse> => {
    try {
      logger.debug(loggerPrefix, 'getOne', request);
      const found: Idea = await this.useCases.getOne(request.params.id);
      if (found) {
        return {
          status: HttpStatusCodes.Ok,
          body: { found },
          error: false
        };
      } else {
        return {
          status: HttpStatusCodes.NotFound,
          body: {},
          // FIXME unify error messages with enum or so?
          error: 'Idea not found'
        };
      }
    } catch (error) {
      logger.error(loggerPrefix, 'error in getOne', error);
      return {
        status: HttpStatusCodes.BadRequest,
        body: {},
        error: error.message
      };
    }
  };

  public getAll = async (request: HttpRequest): Promise<HttpResponse> => {
    try {
      logger.debug(loggerPrefix, 'getAll', request);
      const found: Idea[] = await this.useCases.getAll();
      return {
        status: 201,
        body: { found },
        error: false
      };
    } catch (error) {
      logger.error(loggerPrefix, 'error in getAll', error);
      return {
        status: HttpStatusCodes.BadRequest,
        body: {},
        error: error.message
      };
    }
  };
}
