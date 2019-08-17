import * as express from 'express';
import bodyParser = require('body-parser');

import {
  makeHttpRequest,
  expressResponseHandler,
  HttpClient,
  Logger,
  MessageQueue
} from '@cents-ideas/utils';

/* import { ApiAdapter } from './api-adapter';
import { handleExpressResponse } from './express-response'; */

const httpClient = new HttpClient();
const logger = new Logger('⛩️ ');
const mq = new MessageQueue();

const port: number = 3000;
const app = express();

const { IDEAS_SERVICE_HOST } = process.env;
const IDEAS_URL: string = `http://${IDEAS_SERVICE_HOST}`;
logger.debug('ideas service url', IDEAS_URL);

// TODO some kind of rpc implementation (simple request response model)
// TODO find a way ro restart all services when changes in /packages occur?!
// TODO proper error handling
// TODO helmet , cors in gateway instaed of in every service

app.use(bodyParser.json());

app.get('/ideas/create', async (_req, res) => {
  logger.debug('create new idea');
  const response = await mq.request('create idea');
  const json = JSON.parse(response.toString());
  logger.debug('idea created', json.body.created.id);
  res.send(json);
});

app.get('/ideas/:id', async (req, res) => {
  const request = makeHttpRequest({ request: req });
  logger.info('get one idea', request.params.id);
  const response = await httpClient.post(`${IDEAS_URL}/get-one`, request);
  // TODO _id -> id
  logger.info('idea fetched', response.body.found._id);
  expressResponseHandler({ res, httpResponse: response });
});

app.get('/ideas', async (req, res) => {
  const request = makeHttpRequest({ request: req });
  logger.info('get all ideas', request.ip);
  const response = await httpClient.post(`${IDEAS_URL}/get-all`, request);
  logger.info(`fetched all ${response.body.found.length} ideas`);
  expressResponseHandler({ res, httpResponse: response });
});

app.get('/', (req, res) => {
  const request = makeHttpRequest({ request: req });
  logger.info('index', request.ip);
  res.send('gateway');
});

app.listen(port, () => {
  logger.info('gateway listening on internal port', port);
});
