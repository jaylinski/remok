import fs from 'fs';

class Response {
  constructor() {
    this._hash = null;
    this.status = {
      code: null,
      message: null,
    };
    this.headers = {};
    this.body = null;
  }
}

class HttpResponse extends Response {
  /**
   * @param {object} httpResponse  A instance of `http.IncomingMessage`.
   * @param {string} httpResponseBody
   */
  constructor(httpResponse, httpResponseBody) {
    super();

    this._hash = null;
    this.status.code = httpResponse.statusCode;
    this.status.message = httpResponse.statusMessage;
    this.headers = httpResponse.headers;
    this.body = httpResponseBody;
  }
}

class FileResponse extends Response {
  /**
   * @param {string} path
   */
  constructor(path) {
    super();

    const mock = JSON.parse(fs.readFileSync(path, 'utf8'));

    this._hash = mock.response._hash;
    this.status = mock.response.status;
    this.headers = mock.response.headers;
    this.body = mock.response.body;
  }
}

export { HttpResponse, FileResponse };
