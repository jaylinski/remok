import RequestResponse from './models/RequestResponse';
import Print from './utils/Print';

export default class Remok {
  constructor(options, { MockProxy, MockServer, MockRepository }) {
    this.options = options;
    this.middlwares = [];
    this.middlewaresProxy = [];
    this.MockProxy = MockProxy;
    this.MockServer = MockServer;
    this.MockRepository = MockRepository;
  }

  async start() {
    await this.MockServer.start();
    this.MockServer.on('request', async (Request, httpResponse) => {
      try {
        const Response = await this.getResponse(Request);
        this.MockServer.sendResponse(httpResponse, Response);
      } catch (error) {
        Print.error(error);
        this.MockServer.sendError(httpResponse, error);
      }
    });
  }

  async stop() {
    await this.MockServer.stop();
  }

  /**
   * Get a response.
   *
   * @param {object} Request
   * @returns {Promise}
   */
  async getResponse(Request) {
    Print.info(`Received request ${Request.method} "${Request.url}"`);

    try {
      const { Response, mockPath } = await this.MockRepository.findByRequest(Request);
      // TODO Always check proxy response (proxy target could return different responses on identical requests)
      if (this.overwriteMocks()) throw `Overwriting existing mock "${mockPath}"`;
      Print.success(`Responding with existing mock "${mockPath}"`);
      return Response;
    } catch (error) {
      Print.warning(error);

      if (this.options.mocks.record) {
        Print.debug('Proxying to server ...');
        const { Response } = await this.MockProxy.request(Request);
        await this.MockRepository.save(new RequestResponse(Request, Response));
        Print.success('Recorded new mock!');
        return Response;
      }

      Print.error('No mock found and recording disabled.');
      throw 'Not found / Recording disabled';
    }
  }

  /**
   * Checks if existing mocks should be overwritten.
   *
   * @returns {boolean}
   */
  overwriteMocks() {
    return this.options.mocks.record === 'overwrite';
  }

  /**
   * Registers a middleware.
   *
   * @param args
   */
  use(args) {
    this.middlwares.push(args);
  }

  /**
   * Registers a middleware for proxy requests.
   *
   * @param args
   */
  useProxy(args) {
    this.middlewaresProxy.push(args);
  }
}
