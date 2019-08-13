import { HttpRequest, HttpResponse, makeHttpRequest } from '@cents-ideas/utils';
import * as express from 'express';
import { createIdea } from './controllers';
import makeFakeIdea from './test/idea.mock';

const port: number = 3000;
const app = express();

app.post('/', async (req, res) => {
  // TODO remove this soon
  req.body = makeFakeIdea();
  const request: HttpRequest = makeHttpRequest({ request: req });
  const response: HttpResponse = await createIdea(request);
  res.json(response);
});

app.use('**', (_req, res) => {
  res.send('ideas service');
});

app.use((err: Error, _req: express.Request, res: express.Response) => {
  console.error(err.stack);
  res.status(500).send('something went wrong');
});

app.listen(port, () => {
  console.log('ideas service listening on port ', port);
});
