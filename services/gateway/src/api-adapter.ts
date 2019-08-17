import axios, { AxiosResponse, AxiosInstance } from 'axios';
import { Request } from 'express';

import { HttpResponse } from '@cents-ideas/types';

export class ApiAdapter {
  constructor(private url: string) {}

  public post = async (req: Request, path: string): Promise<HttpResponse> => {
    const response: AxiosResponse = await this.createAdapterFromExpressRequest(req).post(
      this.url + path,
      req.body
    );
    return response.data;
  };

  private createAdapterFromExpressRequest = (req: Request): AxiosInstance => {
    return axios.create({
      params: req.params,
      headers: { ip: req.ip, ...req.headers }
    });
  };
}
