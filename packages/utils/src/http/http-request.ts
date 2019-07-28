import { Request } from 'express';

const makeHttpRequest: MakeHttpRequest = ({ request }) => {
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

interface MakeHttpRequestPayload {
  request: Request;
}

interface HttpRequest {
  body?: any;
  query?: any;
  params?: any;
  ip?: string;
  method?: string;
  path?: string;
  url?: string;
  cookies?: any;
  headers?: any;
}

type MakeHttpRequest = (payload: MakeHttpRequestPayload) => HttpRequest;

export { makeHttpRequest, MakeHttpRequest, HttpRequest };
