import * as express from 'express';
import bodyParser = require('body-parser');

import { HttpRequest, HttpResponse } from '@cents-ideas/types';
import { Queries, Commands } from '@cents-ideas/enums';

import { IdeaController } from './idea-controllers';
import { IdeaUseCases } from './idea-use-cases';
import { IdeaDatabase } from './idea-database';
import env from './environment';
import makeIdea from './idea';

const { logger } = env;
const database = new IdeaDatabase();
const useCases = new IdeaUseCases(database, makeIdea);
const controller = new IdeaController(useCases);
const port: number = 3000;
const app = express();

app.use(bodyParser.json());

const expressJsonAdapter = (controller: Function) => {
  return async (req: express.Request, res: express.Response) => {
    const httpRequest: HttpRequest = req.body;
    logger.info(req.path);
    const response: HttpResponse = await controller(httpRequest);
    logger.info(req.path, ' -> done');
    res.json(response);
  };
};

app.post(`/commands/${Commands.Ideas.Create}`, expressJsonAdapter(controller.create));
app.post(`/queries/${Queries.Ideas.GetOne}`, expressJsonAdapter(controller.getOne));
app.post(`/queries/${Queries.Ideas.GetAll}`, expressJsonAdapter(controller.getAll));

app.listen(port, () => logger.info('ideas service listening on internal port', port));
