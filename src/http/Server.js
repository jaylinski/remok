import http from 'http';
import EventEmitter from 'events';
import Request from '../models/Request';
import Print from './../utils/Print';

export default class Server extends EventEmitter {
  constructor(options) {
    super();

    this.options = options;

    this.server = http.createServer((request, response) => {
      this.handleRequest(request, response);
    });
  }

  async start() {
    return new Promise((resolve) => {
      this.server.listen({ host: this.options.host, port: this.options.port }, () => {
        Print.log(`🔁 Remok server running at ${this.options.host}:${this.options.port}`);
        resolve();
      });
    });
  }

  async stop() {
    return new Promise((resolve) => {
      this.server.close(() => {
        resolve();
      });
    });
  }

  /**
   * Handle client request.
   *
   * @param {object} request
   * @param {object} response
   */
  handleRequest(request, response) {
    let data = [];

    request
      .on('error', (error) => {
        Print.error(error);
      })
      .on('data', (chunk) => {
        data.push(chunk);
      })
      .on('end', () => {
        const body = data.length > 0 ? Buffer.concat(data).toString() : null;
        const RequestObj = new Request(request, body);
        this.emit('request', RequestObj, response);
      });
  }

  /**
   * Respond to client.
   *
   * @param {object} httpResponse
   * @param {object} Response
   */
  sendResponse(httpResponse, Response) {
    httpResponse.statusCode = Response.status.code;
    httpResponse.statusMessage = Response.status.message;
    Object.entries(Response.headers).forEach(([header, value]) => {
      httpResponse.setHeader(header, value);
    });
    httpResponse.end(Response.body);
  }

  /**
   * Respond to client with an error.
   *
   * The HTTP status code is deliberately set to 900 in order
   * to avoid collisions with valid mock-response status codes.
   *
   * @param {object} httpResponse
   * @param {string} message
   */
  sendError(httpResponse, message) {
    httpResponse.statusCode = 900;
    httpResponse.statusMessage = message;
    httpResponse.end();
  }
}
