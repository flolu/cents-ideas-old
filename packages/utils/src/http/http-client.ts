import axios, { AxiosResponse } from 'axios';
import { HttpResponse } from './http-response';

export class HttpClient {
  public post = async (url: string, body: any = {}): Promise<HttpResponse> => {
    const response: AxiosResponse = await axios.post(url, body);
    return this._transformAxiosToHttpResponse(response);
  };

  private _transformAxiosToHttpResponse = ({ data }: AxiosResponse): HttpResponse => {
    return {
      body: data.body,
      statusCode: data.status,
      headers: data.headers
    };
  };
}
