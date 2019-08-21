import { Message } from 'amqplib';

import { HttpRequest, HttpResponse } from '@cents-ideas/types';
import { MessageQueue } from '@cents-ideas/utils';
import { RpcIdeaNames } from '@cents-ideas/enums';

import { IdeaController } from './idea-controllers';
import { IdeaUseCases } from './idea-use-cases';
import { IdeaDatabase } from './idea-database';
import env from './environment';
import makeIdea from './idea';

const { logger } = env;
const mq = new MessageQueue();
const database = new IdeaDatabase();
const useCases = new IdeaUseCases(database, makeIdea);
const controller = new IdeaController(useCases);

const rpcJsonAdapter = (rpcName: RpcIdeaNames, controller: Function) => {
  mq.reply(rpcName, async (message: Message, respond: Function) => {
    const httpRequest: HttpRequest = JSON.parse(message.content.toString());
    logger.info(rpcName);
    const response: HttpResponse = await controller(httpRequest);
    logger.info(rpcName, ' -> done');
    respond(JSON.stringify(response));
  });
};

rpcJsonAdapter(RpcIdeaNames.Create, controller.create);
rpcJsonAdapter(RpcIdeaNames.GetOne, controller.getOne);
rpcJsonAdapter(RpcIdeaNames.GetAll, controller.getAll);
