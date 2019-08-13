import axios, { AxiosResponse } from 'axios';
import { HttpResponse } from './http-response';

export class HttpClient {
  public post = async (url: string, body: any = {}): Promise<HttpResponse> => {
    const response: AxiosResponse = await axios.post(url, body);
    return this._transformAxiosToHttpResponse(response);
  };

  private _transformAxiosToHttpResponse = ({
    data,
    status,
    headers
  }: AxiosResponse): HttpResponse => {
    return {
      body: data,
      statusCode: status,
      headers: headers
    };
  };
}
