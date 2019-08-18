import { Response } from 'express';
import { HttpResponse } from '@cents-ideas/types';

export const handleExpressResponse = (res: Response, httpResponse: HttpResponse): void => {
  if (httpResponse.headers) {
    res.set(httpResponse.headers);
  }
  res.status(httpResponse.status).send(httpResponse.body);
};
