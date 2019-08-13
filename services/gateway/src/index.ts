import * as express from 'express';

import {
  HttpResponse,
  HttpRequest,
  makeHttpRequest,
  expressResponseHandler,
  HttpClient
} from '@cents-ideas/utils';

/* class Gateway {
  public app: express.Application;

  public static bootstrap = (): Gateway => new Gateway();

  constructor() {
    this.app = express();
    this._configureRoutes();
  }

  private _configureRoutes = () => {
    let router: express.Router = express.Router();

    this.app.use(router);
  };
}
 */
const port: number = 3000;
const app = express();
const httpClient = new HttpClient();

const { IDEAS_SERVICE_HOST } = process.env;
const IDEAS_URL: string = `http://${IDEAS_SERVICE_HOST}`;

app.get('/ideas/create', async (req, res) => {
  const request: HttpRequest = makeHttpRequest({ request: req });
  const httpResponse: HttpResponse = await httpClient.post(IDEAS_URL, request.body);
  expressResponseHandler({ res, httpResponse });
});

app.use('**', (_req, res) => {
  res.send('gateway');
});

app.use((err: Error, _req: express.Request, res: express.Response) => {
  console.error(err.stack);
  res.status(500).send('something went wrong');
});

app.listen(port, () => {
  console.log('gateway listening on port', port);
});
