import { HttpRequest, HttpResponse } from '@cents-ideas/utils';
import * as express from 'express';
import { createIdea } from './controllers';
import makeIdea from './idea';
import makeFakeIdea from './test/idea.mock';

const port: number = 3001;
const app = express();

app.get('/create', async (req, res) => {
  const request: HttpRequest = {
    ...req,
    body: makeFakeIdea()
  };
  const response: HttpResponse = await createIdea(request);
  res.send('created fake idea...' + JSON.stringify(response.body));
});

app.use('**', (_req, res) => {
  const idea = makeIdea({
    userId: 'mock-user-id',
    title: 'title',
    description: 'description'
  });
  res.send('test: ' + JSON.stringify(idea));
});

app.listen(port, () => {
  console.log('Ideas service listening on port ', port);
});
