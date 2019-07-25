import * as express from 'express';

const port: number = 3000;
const app = express();

app.use('**', (_req, res) => {
  res.send('Gateway');
});

app.listen(port, () => {
  console.log('Gateway listening on port', port);
});
