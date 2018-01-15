export default class RequestResponse {
  /**
   * @param {object} request A instance of `models/Request`.
   * @param {object} response A instance of `models/Response`.
   */
  constructor(request, response) {
    this.time = new Date().toISOString();
    this.request = request;
    this.response = response;
  }
}
