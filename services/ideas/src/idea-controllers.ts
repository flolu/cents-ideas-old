import { HttpRequest, HttpResponse, Idea } from '@cents-ideas/types';
import { HttpStatusCodes } from '@cents-ideas/enums';

import { IdeaUseCases } from './idea-use-cases';

import env from './environment';
const { logger } = env;
const loggerPrefix: string = 'controller ->';

export class IdeaController {
  constructor(private useCases: IdeaUseCases) {}

  public create = async (request: HttpRequest): Promise<HttpResponse<{ created?: Idea }>> => {
    try {
      logger.debug(loggerPrefix, 'create', request);
      const created: Idea = await this.useCases.add(request.body);
      if (false) {
        // TODO message queue events
        //this.mq.publish('idea created', created);
      }
      return {
        status: HttpStatusCodes.Created,
        body: { created },
        error: false
      };
    } catch (error) {
      // FIXME find a way to handle expected errors
      logger.error(loggerPrefix, 'error in create: ', error.message);
      return {
        status: HttpStatusCodes.BadRequest,
        body: {},
        error: error.message
      };
    }
  };

  public getOne = async (request: HttpRequest): Promise<HttpResponse<{ found?: Idea }>> => {
    try {
      logger.debug(loggerPrefix, 'getOne', request);
      const found: Idea = await this.useCases.getOne(request.params.id);
      return {
        status: HttpStatusCodes.Ok,
        body: { found },
        error: false
      };
    } catch (error) {
      logger.error(loggerPrefix, 'error in getOne: ', error.message);
      // FIXME better method to handle expected errors
      if (error.message === 'Idea not found') {
        return {
          status: HttpStatusCodes.NotFound,
          body: {},
          error: error.message
        };
      }
      return {
        status: HttpStatusCodes.BadRequest,
        body: {},
        error: error.message
      };
    }
  };

  public getAll = async (request: HttpRequest): Promise<HttpResponse<{ found?: Idea[] }>> => {
    try {
      logger.debug(loggerPrefix, 'getAll', request);
      const found: Idea[] = await this.useCases.getAll();
      return {
        status: 201,
        body: { found },
        error: false
      };
    } catch (error) {
      logger.error(loggerPrefix, 'error in getAll: ', error.message);
      return {
        status: HttpStatusCodes.BadRequest,
        body: {},
        error: error.message
      };
    }
  };
}
