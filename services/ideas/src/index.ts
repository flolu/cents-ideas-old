import * as express from 'express';

const port: number = 3001;
const app = express();

app.use('**', (_req, res) => {
  res.send('Ideas');
});

app.listen(port, () => {
  console.log('Ideas service listening on port ', port);
});
