import * as express from 'express';
import bodyParser = require('body-parser');

import { HttpStatusCodes, Commands, Queries } from '@cents-ideas/enums';

import env from './environment';
import { ExpressAdapter } from './express-adapter';

const { logger } = env;
const expressAdapter = new ExpressAdapter();
const port: number = env.port || 3000;
const app = express();
const ideasApiRoot: string = '/ideas';

// FIXME clicking on a typescript type should get you to the .ts file not the computed one!
// FIXME find a way ro restart all services when changes in /packages occur?!
// FIXME helmet, cors in gateway instead of in every service

app.use(bodyParser.json());

// NEXT env vars
const ideasHost: string = 'http://ideas:3000';

app.post(
  `${ideasApiRoot}`,
  expressAdapter.makeJsonAdapter(`${ideasHost}/commands/${Commands.Ideas.Create}`)
);
app.get(
  `${ideasApiRoot}/:id`,
  expressAdapter.makeJsonAdapter(`${ideasHost}/queries/${Queries.Ideas.GetOne}`)
);
app.get(
  `${ideasApiRoot}`,
  expressAdapter.makeJsonAdapter(`${ideasHost}/queries/${Queries.Ideas.GetAll}`)
);

app.get('**', (_req, res) => res.status(HttpStatusCodes.NotFound).send());
app.listen(port, () => logger.info('gateway listening on internal port', port));
