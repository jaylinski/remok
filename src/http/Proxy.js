import http from 'http';
import https from 'https';
import url from 'url';
import { HttpResponse } from '../models/Response';

export default class Proxy {
  constructor(options) {
    this.url = url.parse(options.target);
    this.options = {
      host: this.url.hostname,
      port: this.url.port || (this.url.protocol === 'https:' ? 443 : 80),
      timeout: options.timeout,
    };
  }

  /**
   * Proxy the request.
   *
   * @param {object} Request
   */
  async request(Request) {
    const requestOptions = Object.assign(this.options, {
      path: url.parse(Request.url).path,
      method: Request.method,
      headers: Object.assign({}, Request.headers),
    });

    const protocol = this.url.protocol === 'https:' ? https : http;

    // Overwrite the host in order to avoid certificate errors.
    requestOptions.headers['host'] = this.options.host;

    // Don't request gzipped data so we don't have to decode the response body.
    // TODO (P4 Nice To Have) Make the proxy gzip compatible in order to improve performance.
    delete requestOptions.headers['accept-encoding'];

    return new Promise((resolve, reject) => {
      const clientRequest = protocol.request(requestOptions, (response) => {
        let data = [];

        response
          .on('data', (chunk) => {
            data.push(chunk);
          })
          .on('end', () => {
            const body = data.length > 0 ? Buffer.concat(data).toString() : null;
            const Response = new HttpResponse(response, body);
            resolve({ Response });
          });
      });
      clientRequest.on('error', (e) => reject(e));
      clientRequest.on('timeout', () => {
        clientRequest.abort();
        reject('Proxy request timed out. You can increase the timeout by setting the `proxy.timeout` option.');
      });
      clientRequest.write(Request.body || '');
      clientRequest.end();
    });
  }
}
