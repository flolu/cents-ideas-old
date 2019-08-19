import * as express from 'express';
import bodyParser = require('body-parser');

import { MessageQueue } from '@cents-ideas/utils';

import env from './environment';
import { ExpressAdapter } from './express-adapter';

const { logger } = env;
const mq = new MessageQueue();
const expressAdapter = new ExpressAdapter(mq);
const port: number = env.port;
const app = express();
const ideasApiRoot: string = '/ideas';

// TODO find a way ro restart all services when changes in /packages occur?!
// TODO proper error handling
// TODO helmet , cors in gateway instead of in every service

app.use(bodyParser.json());

app.get(`${ideasApiRoot}/create`, expressAdapter.makeJsonAdapter('create idea'));
app.get(`${ideasApiRoot}/:id`, expressAdapter.makeJsonAdapter('get one idea'));
app.get(`${ideasApiRoot}`, expressAdapter.makeJsonAdapter('get all ideas'));

app.get('**', (_req, res) => res.send('cents-ideas-gateway'));
app.listen(port, () => logger.info('gateway listening on internal port', port));
