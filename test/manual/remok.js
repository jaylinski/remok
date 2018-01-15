'use strict';

require = require('@std/esm')(module);

const remok = require('./../../src/index').default;

const mockServer = remok({
  proxy: {
    target: 'http://localhost:8080',
  },
  mocks: {
    record: true,
    watch: true,
  },
});

mockServer.start().then(() => {
  // mockServer.stop();
});
