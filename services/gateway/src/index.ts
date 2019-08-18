import * as express from 'express';
import bodyParser = require('body-parser');

import { MessageQueue } from '@cents-ideas/utils';

import env from './environment';
import { makeHttpRequest } from './express-request';
import { handleExpressResponse } from './express-response';

const { logger } = env;
const mq = new MessageQueue();

const port: number = env.port;
const app = express();

// TODO find a way ro restart all services when changes in /packages occur?!
// TODO proper error handling
// TODO helmet , cors in gateway instead of in every service

app.use(bodyParser.json());

// TODO simplify and abstract express away from logic
app.get('/ideas/create', async (req, res) => {
  const request = makeHttpRequest(req);
  logger.info('create new idea');
  // TODO util for queue names?
  const response = await mq.request('create idea', request);
  const json = JSON.parse(response.toString());
  logger.info('idea created', json.body.created.id);
  handleExpressResponse(res, json);
});

app.get('/ideas/:id', async (req, res) => {
  const request = makeHttpRequest(req);
  logger.info('get one idea', request.params.id);
  const response = await mq.request('get one idea', request);
  const json = JSON.parse(response.toString());
  // TODO _id -> id
  logger.info('idea fetched', json.body.found._id);
  handleExpressResponse(res, json);
});

app.get('/ideas', async (req, res) => {
  const request = makeHttpRequest(req);
  logger.info('get all ideas', request.ip);
  const response = await mq.request('get all ideas', request);
  const json = JSON.parse(response.toString());
  // TODO _id -> id
  logger.info(`fetched all ${json.body.found.length} ideas`);
  handleExpressResponse(res, json);
});

app.get('/', (_req, res) => {
  res.send('gateway');
});

app.listen(port, () => {
  logger.info('gateway listening on internal port', port);
});
