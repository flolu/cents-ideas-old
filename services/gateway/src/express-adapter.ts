import * as express from 'express';

import { HttpRequest, HttpResponse } from '@cents-ideas/types';
import { MessageQueue } from '@cents-ideas/utils';

import env from './environment';

const { logger } = env;

export class ExpressAdapter {
  constructor(private messageQueue: MessageQueue) {}

  // FIXME timeout handler either here or in mq
  public makeJsonAdapter = (controllerId: string): express.RequestHandler => {
    return async (req: express.Request, res: express.Response) => {
      const httpRequest: HttpRequest = this.makeHttpRequestFromExpressRequest(req);
      logger.info(controllerId);
      const response: string = await this.messageQueue.request(
        controllerId,
        JSON.stringify(httpRequest)
      );
      const httpResponse: HttpResponse = JSON.parse(response);
      logger.info(controllerId, ' -> done');
      this.handleExpressHttpResponse(res, httpResponse);
    };
  };

  private handleExpressHttpResponse = (res: express.Response, httpResponse: HttpResponse): void => {
    if (httpResponse.headers) {
      res.set(httpResponse.headers);
    }
    res.status(httpResponse.status).send(httpResponse.body);
  };

  private makeHttpRequestFromExpressRequest = (expressRequest: express.Request): HttpRequest => {
    return Object.freeze({
      body: expressRequest.body,
      query: expressRequest.query,
      params: expressRequest.params,
      ip: expressRequest.ip,
      method: expressRequest.method,
      path: expressRequest.path,
      url: expressRequest.url,
      cookies: expressRequest.cookies,
      headers: expressRequest.headers
    });
  };
}
