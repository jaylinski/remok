#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const makeDir = require('make-dir');
const remok = require('./../dist/remok.js');

function getConfig(configPath) {
  return require(`${process.cwd()}${path.sep}${configPath}`);
}

function getMockTemplate() {
  return `{
  "time": "${new Date().toISOString()}",
  "request": {
    "_hash": "requesthashvalue",
    "method": "GET",
    "path": "/foo/bar",
    "headers": {
      "key": "value"
    },
    "query": null,
    "body": null
  },
  "response": {
    "_hash": "responsehashvalue",
    "status": {
      "code": 201,
      "message": "custom status message"
    },
    "headers": {
      "key": "value"
    },
    "body": "I'm the response body!"
  }
}`;
}

function createMock(path) {
  const filePath = `${path}.@override.json`;
  makeDir.sync(path.substr(0, path.lastIndexOf('/')));
  fs.writeFileSync(filePath, getMockTemplate());
  console.log(`Created file ${filePath}`);
  process.exit(0);
}

function printHelp() {
  console.log(`remok [OPTIONS...] [COMMAND]

OPTIONS
  -c, --config   Use this config file
      --help     Show this help
 
COMMANDS
  create-mock    Create a mock file with default values
                  Example: $ npx remok create-mock ./mocks/GET>
                  This will create the file \`GET.@override.json\` in the \`mocks\` directory`);
}

// Process CLI arguments
process.argv.slice(2).forEach((arg, index) => {
  if (arg === 'create-mock') {
    createMock(process.argv[index + 3]);
    process.exit(0);
  } else if (arg === '--config' || arg === '-c') {
    remok(getConfig(process.argv[index + 3])).start();
  } else if (arg === '--help') {
    printHelp();
    process.exit(0);
  }
});

// If no arguments were provided, start Remok with default options.
if (process.argv.length === 2) {
  remok().start();
}
