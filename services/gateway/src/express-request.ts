import * as express from 'express';
import { HttpRequest } from '@cents-ideas/types';

export const makeHttpRequest = (request: express.Request): HttpRequest => {
  return Object.freeze({
    body: request.body,
    query: request.query,
    params: request.params,
    ip: request.ip,
    method: request.method,
    path: request.path,
    url: request.url,
    cookies: request.cookies,
    headers: {
      'Content-Type': request.get('Content-Type'),
      Referer: request.get('referer'),
      'User-Agent': request.get('User-Agent')
    }
  });
};
