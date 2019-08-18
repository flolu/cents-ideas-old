export interface HttpRequest {
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
