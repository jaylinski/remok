export default class Request {
  /**
   * @param {object} httpRequest
   * @param {string} httpRequestBody
   */
  constructor(httpRequest, httpRequestBody) {
    this._hash = null;
    this.method = httpRequest.method;
    this.url = httpRequest.url;
    this.headers = httpRequest.headers;
    this.body = httpRequestBody;
  }
}
