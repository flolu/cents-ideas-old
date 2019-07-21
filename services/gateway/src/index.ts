import { centsMeaning, inventedBy } from '@cents-ideas/common';
import * as express from 'express';

const port: number = 3000;
const app = express();

app.use('**', (_req, res) => {
  res.send(inventedBy);
});

app.listen(port, () => {
  console.log(
    'CENTS means: ',
    centsMeaning,
    ' and it was invented by',
    inventedBy
  );
});
