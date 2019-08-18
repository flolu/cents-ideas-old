import { HttpRequest } from '@cents-ideas/types';
import { MessageQueue } from '@cents-ideas/utils';

import { IdeaController } from './idea-controllers';
import { IdeaUseCases } from './idea-use-cases';
import { IdeaDatabase } from './idea-database';
import env from './environment';
import makeIdea from './idea';
import makeFakeIdea from './test/idea.mock';

const { logger } = env;
const mq = new MessageQueue();
const database = new IdeaDatabase();
const useCases = new IdeaUseCases(database, makeIdea);
const controller = new IdeaController(useCases);

// TODO simplify
// TODO unify request payload type by mq
mq.reply('create idea', async (message: any, respond) => {
  const httpRequest: HttpRequest = JSON.parse(message.content.toString());
  logger.info('create idea');
  const response = await controller.create({ ...httpRequest, body: makeFakeIdea() });
  respond(JSON.stringify(response));
});

mq.reply('get one idea', async (message: any, respond) => {
  const httpRequest: HttpRequest = JSON.parse(message.content.toString());
  logger.info('get one idea', httpRequest.params.id);
  const response = await controller.getOne(httpRequest);
  logger.info('got one idea', response.body.found.id);
  respond(JSON.stringify(response));
});

mq.reply('get all ideas', async (message: any, respond) => {
  logger.info('get all ideas');
  const httpRequest: HttpRequest = JSON.parse(message.content.toString());
  const response = await controller.getAll(httpRequest);
  logger.info('got all ', response.body.found.length, ' ideas');
  respond(JSON.stringify(response));
});
