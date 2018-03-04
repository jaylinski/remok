const fs = require('fs');
const path = require('path');

require = require('@std/esm')(module);

const Repository = require('../Repository').default;

const directory = './test/mocks';
const watch = false;
const hash = {
  request: () => 'reqHashValue',
  response: () => 'resHashValue',
};

let RepositoryObj;

describe('Repository', () => {
  beforeEach(() => {
    RepositoryObj = new Repository({ directory, watch, hash });
  });

  afterAll(() => {
    fs.unlinkSync(`${directory}${path.sep}GET.reqHashValue.resHashValue.json`);
  });

  test('It finds a manual mock by a request', async () => {
    const { Response, mockPath } = await RepositoryObj.findByRequest({
      method: 'GET',
      url: '/foo/bar',
    });

    expect(mockPath).toBe('./test/mocks/foo/bar/GET.@override.json');
    expect(Response._hash).toBe('resHashValue');
  });

  test('It saves a mock by a request-response', async () => {
    const RequestResponse = {
      time: 1234,
      request: {
        _hash: null,
        method: 'GET',
        url: '/',
      },
      response: {
        _hash: null,
      },
    };
    expect.assertions(1);
    await expect(RepositoryObj.save(RequestResponse)).resolves.toBe(true);
  });
});
