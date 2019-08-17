import * as express from 'express';
import bodyParser = require('body-parser');

import { makeHttpRequest, expressResponseHandler, HttpClient, Logger } from '@cents-ideas/utils';

const httpClient = new HttpClient();
const logger = new Logger('⛩️ ');

const port: number = 3000;
const app = express();

const { IDEAS_SERVICE_HOST } = process.env;
const IDEAS_URL: string = `http://${IDEAS_SERVICE_HOST}`;
logger.debug('ideas service url', IDEAS_URL);

// TODO some kind of rpc implementation (simple request response model)
// TODO find a way ro restart all services when changes in /packages occur?!
// TODO proper error handling

app.use(bodyParser.json());

app.get('/ideas/create', async (req, res) => {
  const request = makeHttpRequest({ request: req });
  logger.info('create idea', request.ip);
  const response = await httpClient.post(IDEAS_URL, request);
  logger.info('idea created', response.body.created.id);
  expressResponseHandler({ res, httpResponse: response });
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
