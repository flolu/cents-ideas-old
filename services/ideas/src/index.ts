import * as express from 'express';
import makeFakeIdea from './test/idea.mock';
import { IdeaController } from './idea-controllers';
import { IdeaUseCases } from './idea-use-cases';
import { IdeaDatabase } from './idea-database';
import makeIdea from './idea';
import { HttpRequest } from '@cents-ideas/types';
import bodyParser = require('body-parser');
import { env } from './environment';

const port: number = env.port;
const app = express();

const database = new IdeaDatabase();
const useCases = new IdeaUseCases(database, makeIdea);
const controller = new IdeaController(useCases);

app.use(bodyParser());

app.post('/', async (req, res) => {
  const request: HttpRequest = req.body;
  const response = await controller.create({ ...request, body: makeFakeIdea() });
  res.json(response);
});

app.post('/get-one', async (req, res) => {
  const request: HttpRequest = req.body;
  const response = await controller.getOne(request);
  res.json(response);
});

app.post('/get-all', async (req, res) => {
  const request: HttpRequest = req.body;
  const response = await controller.getAll(request);
  res.json(response);
});

app.use((err: Error, _req: express.Request, res: express.Response) => {
  console.error(err.stack);
  res.status(500).send('something went wrong');
});

app.use('**', (_req, res) => {
  res.send('ideas service wildcard');
});

app.listen(port, () => {
  console.log('ideas service listening on port ', port);
});
