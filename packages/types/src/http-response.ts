export interface HttpResponse<T = any> {
  body: T;
  status: number;
  error: any;
  headers?: { [key: string]: string };
}
