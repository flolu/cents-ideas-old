import * as express from 'express';
import makeIdea from './idea';

const port: number = 3001;
const app = express();

app.use('**', (_req, res) => {
  const idea = makeIdea({
    userId: 'mock-user-id',
    title: 'title',
    description: 'description'
  });
  res.send(JSON.stringify(idea));
});

app.listen(port, () => {
  console.log('Ideas service listening on port ', port);
});
