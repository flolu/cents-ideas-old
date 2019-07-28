interface HttpResponse {
  body: any;
  statusCode: number;
  error?: any;
  headers?: { [key: string]: string };
}

export { HttpResponse };
