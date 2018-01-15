import Remok from './Remok';
import Server from './http/Server';
import Proxy from './http/Proxy';
import Repository from './Repository';
import { defaultOptions, namespace } from './config/defaults';

/**
 * Builds the Remok object.
 *
 * @param opt
 * @returns {object}
 */
function remokFactory(opt = {}) {
  const options = {
    verbose: opt.verbose !== undefined ? opt.verbose : defaultOptions.verbose,
    server: Object.assign(defaultOptions.server, opt.server),
    mocks: Object.assign(defaultOptions.mocks, opt.mocks),
    proxy: Object.assign(defaultOptions.proxy, opt.proxy),
  };

  global[namespace] = { verbose: options.verbose };

  const MockProxy = new Proxy(options.proxy);
  const MockServer = new Server(options.server);
  const MockRepository = new Repository({
    directory: options.mocks.path,
    watch: options.mocks.watch,
    hash: {
      request: options.mocks.reqHash,
      response: options.mocks.resHash,
    },
  });

  return new Remok(options, {
    MockProxy,
    MockServer,
    MockRepository,
  });
}

export default remokFactory;
