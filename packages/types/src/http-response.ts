export interface HttpResponse<T = any> {
  body: T;
  status: number;
  error: any | boolean;
  headers?: { [key: string]: string };
}
