export interface HttpResponse {
  body: any;
  status: number;
  error?: any;
  headers?: { [key: string]: string };
}
