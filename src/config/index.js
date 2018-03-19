import hash from './../utils/hash';

export const namespace = 'remok';
export const defaultOptions = {
  verbose: true,
  server: {
    host: 'localhost',
    port: 3000,
  },
  mocks: {
    record: true,
    path: './remok',
    watch: false,
    reqHash: (Request) => hash(`${Request.method}${Request.url}${JSON.stringify(Request.headers)}${Request.body}`),
    resHash: (Response) =>
      hash(`${JSON.stringify(Response.status)}${JSON.stringify(Response.headers)}${Response.body}`),
  },
  proxy: {
    target: 'http://localhost',
    timeout: 5000,
  },
};
