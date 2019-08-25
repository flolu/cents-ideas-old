import * as express from 'express';
import axios from 'axios';

import { HttpRequest, HttpResponse } from '@cents-ideas/types';

import env from './environment';

const { logger } = env;

export class ExpressAdapter {
  // FIXME timeout handler either here or in mq
  public makeJsonAdapter = (url: string): express.RequestHandler => {
    return async (req: express.Request, res: express.Response) => {
      const httpRequest: HttpRequest = this.makeHttpRequestFromExpressRequest(req);
      logger.info(url);
      const response = await axios.post(url, httpRequest);
      const httpResponse: HttpResponse = response.data;
      logger.info(url, ' -> done');
      this.handleExpressHttpResponse(res, httpResponse);
    };
  };

  private handleExpressHttpResponse = (res: express.Response, httpResponse: HttpResponse): void => {
    if (httpResponse.headers) {
      res.set(httpResponse.headers);
    }
    let body = { ...httpResponse.body };
    if (httpResponse.error) {
      body = { ...body, error: httpResponse.error };
    }
    res.status(httpResponse.status).send(body);
  };

  private makeHttpRequestFromExpressRequest = (expressRequest: express.Request): HttpRequest => {
    return {
      body: expressRequest.body,
      query: expressRequest.query,
      params: expressRequest.params,
      ip: expressRequest.ip,
      method: expressRequest.method,
      path: expressRequest.path,
      url: expressRequest.url,
      cookies: expressRequest.cookies,
      headers: expressRequest.headers
    };
  };
}
