import * as express from 'express';

import { HttpResponse } from '../http';

const expressResponseHandler: ExpressReponseHandler = ({ res, httpResponse }) => {
  if (httpResponse.headers) {
    res.set(httpResponse.headers);
  }
  res.type('json');
  res.status(httpResponse.statusCode).send(httpResponse.body);
};

interface ExpressReponseHandlerPayload {
  res: express.Response;
  httpResponse: HttpResponse;
}
type ExpressReponseHandler = (payload: ExpressReponseHandlerPayload) => void;

export { expressResponseHandler, ExpressReponseHandlerPayload, ExpressReponseHandler };
