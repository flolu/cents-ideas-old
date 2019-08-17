import * as express from 'express';
import bodyParser = require('body-parser');

import { HttpRequest } from '@cents-ideas/types';
import { MessageQueue /* expressResponseHandler */ } from '@cents-ideas/utils';

import { IdeaController } from './idea-controllers';
import { IdeaUseCases } from './idea-use-cases';
import { IdeaDatabase } from './idea-database';
import env from './environment';
import makeIdea from './idea';
import makeFakeIdea from './test/idea.mock';

const port: number = env.port;
const app = express();
const mq = new MessageQueue();
const database = new IdeaDatabase();
const useCases = new IdeaUseCases(database, makeIdea);
const controller = new IdeaController(useCases);
const { logger } = env;

mq.reply('create idea', async (_request: any, respond) => {
  logger.info('create idea');
  const response = await controller.create({ body: makeFakeIdea() });
  respond(JSON.stringify(response));
});

app.use(bodyParser.json());

app.post('/', async (req, res) => {
  logger.info('create idea', req.headers.ip);
  const response = await controller.create({ body: makeFakeIdea() });
  res.json(response);
  if (!response.error && response.body.created) {
    logger.info('created idea', response.body.created.id);
    //mq.publish('idea created', response.body.created);
  }
});

app.post('/get-one', async (req, res) => {
  const request: HttpRequest = req.body;
  logger.info('get one idea', request.params.ip);
  const response = await controller.getOne(request);
  logger.info('fetched idea', response.body.found.id);
  res.json(response);
});

app.post('/get-all', async (req, res) => {
  const request: HttpRequest = req.body;
  logger.info('get all ideas', request.ip);
  const response = await controller.getAll(request);
  logger.info(`fetched all ${response.body.found.length} ideas`);
  res.json(response);
});

app.listen(port, () => {
  logger.info('ideas service listening on internal port', port);
});
