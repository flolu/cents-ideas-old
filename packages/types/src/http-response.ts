export interface HttpResponse<T = any> {
  body: T | { error: any };
  status: number;
  error: any | boolean;
  headers?: { [key: string]: string };
}
