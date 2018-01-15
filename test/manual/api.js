/**
 * @file Includes a fake API that is used as a proxy target by Remok.
 *       Start via `node test/api/index.js`.
 */

const http = require('http');

const options = { host: 'localhost', port: 8080 };
const timeout = 50; // Use this for testing timeouts.

const server = http.createServer(async (request, response) => {
  console.log(`Received ${request.method} request on "${request.url}":`);
  console.log(request.headers);

  let data = `${request.method} "${request.url}" foo!`;

  // TODO Why isn't this working for POST requests?
  // await new Promise((resolve) => setTimeout(resolve, timeout));

  // Make POST requests return a new result on every request.
  if (request.method === 'POST') {
    data = `${data} ${Date.now()}`;
  }

  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, PATCH');
  if (request.method === 'OPTIONS') {
    response.end();
  } else {
    response.setHeader('Content-Type', 'text/html');
    response.end(data);
  }
});

server.listen(options, () => {
  console.log(`API server running at ${options.host}:${options.port}`);
});
