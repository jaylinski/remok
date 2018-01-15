require = require('@std/esm')(module);

const { HttpResponse } = require('../Response');

let httpIncomingMessage;

describe('Response', () => {
  beforeEach(() => {
    httpIncomingMessage = {
      statusCode: 200,
      statusMessage: undefined,
      headers: {
        foo: 'bar',
      },
    };
  });

  test('It returns a data representation of the object', () => {
    const ResponseObj = new HttpResponse(httpIncomingMessage, 'response body');
    expect(ResponseObj).toEqual({
      _hash: null,
      body: 'response body',
      headers: {
        foo: 'bar',
      },
      status: {
        code: 200,
        message: undefined,
      },
    });
  });
});
