export interface LogQueryParams {
  domain?: string;
  type?: 'tcp' | 'http';
  id?: string;
}

export interface LogStreamQueryParams extends LogQueryParams {
  token?: string;
}
