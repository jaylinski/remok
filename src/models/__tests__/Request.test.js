require = require('@std/esm')(module);

const Request = require('../Request').default;

let httpRequestOptions;

describe('Request', () => {
  beforeEach(() => {
    httpRequestOptions = {
      host: 'domain.tld',
      port: 1337,
      url: '/foo/bar?param=value',
      method: 'GET',
      headers: { foo: 'bar' },
    };
  });

  test('It returns a data representation of the object', () => {
    const RequestObj = new Request(httpRequestOptions, 'request body');
    expect(RequestObj).toEqual({
      _hash: null,
      body: 'request body',
      headers: { foo: 'bar' },
      method: 'GET',
      url: '/foo/bar?param=value',
    });
  });
});
