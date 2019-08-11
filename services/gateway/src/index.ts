import * as express from 'express';
import axios from 'axios';

import { HttpResponse } from '@cents-ideas/utils';

const port: number = 3000;
const app = express();

app.get('/ideas/create', async (req, res) => {
  console.log('create idea');
  const { IDEAS_SERVICE_HOST } = process.env;
  console.log('ideas service host: ', IDEAS_SERVICE_HOST);
  const response: HttpResponse = (await axios.post(`http://${IDEAS_SERVICE_HOST}`, req.body)).data;
  console.log('created idea, response:', response);
  if (response.headers) {
    res.set(response.headers);
  }
  res.type('json');
  res.status(response.statusCode).send(response.body);
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
