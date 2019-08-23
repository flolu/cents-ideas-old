import * as express from 'express';
import bodyParser = require('body-parser');

import { MessageQueue } from '@cents-ideas/utils';
import { RpcIdeaNames, HttpStatusCodes } from '@cents-ideas/enums';

import env from './environment';
import { ExpressAdapter } from './express-adapter';

const { logger } = env;
const mq = new MessageQueue();
const expressAdapter = new ExpressAdapter(mq);
const port: number = env.port;
const app = express();
const ideasApiRoot: string = '/ideas';

// FIXME clicking on a typescript type should get you to the .ts file not the computed one!
// FIXME find a way ro restart all services when changes in /packages occur?!
// FIXME helmet, cors in gateway instead of in every service

app.use(bodyParser.json());

app.get(`${ideasApiRoot}/create`, expressAdapter.makeJsonAdapter(RpcIdeaNames.Create));
app.get(`${ideasApiRoot}/:id`, expressAdapter.makeJsonAdapter(RpcIdeaNames.GetOne));
app.get(`${ideasApiRoot}`, expressAdapter.makeJsonAdapter(RpcIdeaNames.GetAll));

app.get('**', (_req, res) => res.status(HttpStatusCodes.NotFound).send());
app.listen(port, () => logger.info('gateway listening on internal port', port));
