import * as express from 'express';
import bodyParser = require('body-parser');

import {
  HttpResponse,
  HttpRequest,
  makeHttpRequest,
  expressResponseHandler,
  HttpClient
} from '@cents-ideas/utils';

const port: number = 3000;
const app = express();
const httpClient = new HttpClient();

const { IDEAS_SERVICE_HOST } = process.env;
const IDEAS_URL: string = `http://${IDEAS_SERVICE_HOST}`;

app.use(bodyParser());

app.get('/ideas/create', async (req, res) => {
  const request: HttpRequest = makeHttpRequest({ request: req });
  const response: HttpResponse = await httpClient.post(IDEAS_URL, request);
  expressResponseHandler({ res, httpResponse: response });
});

app.get('/ideas/:id', async (req, res) => {
  const request: HttpRequest = makeHttpRequest({ request: req });
  const response: HttpResponse = await httpClient.post(`${IDEAS_URL}/get-one`, request);
  expressResponseHandler({ res, httpResponse: response });
});

app.get('/ideas', async (req, res) => {
  const request: HttpRequest = makeHttpRequest({ request: req });
  const response: HttpResponse = await httpClient.post(`${IDEAS_URL}/get-all`, request);
  expressResponseHandler({ res, httpResponse: response });
});

app.use('**', (_req, res) => {
  res.send('gateway');
});

app.use((err: Error, _req: express.Request, res: express.Response) => {
  console.error(err.stack);
  res.status(500).send('something went wrong');
});

app.listen(port, () => {
  console.log('gateway listening on port', port);
});
