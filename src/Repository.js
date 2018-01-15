import fs from 'fs';
import path from 'path';
import url from 'url';
import makeDir from 'make-dir';
import MockFile from './MockFile';
import { FileResponse } from './models/Response';
import { scandir } from './utils/fs';
import { RTRIM_SLASH } from './utils/path';

const KEY_OVERRIDE = '@override';

export default class Repository {
  /**
   * @param {object} options
   */
  constructor({ directory, watch, hash }) {
    this.directory = directory.replace(RTRIM_SLASH, '');
    this.watch = watch;
    this.hash = hash;
    this.mocks = new Map();

    makeDir.sync(this.directory);
    this.readMocks();
  }

  /**
   * Get all existing mocks.
   *
   * @returns {array}
   */
  readMocks() {
    scandir(this.directory).forEach((filePath) => {
      this.addMock(new MockFile(path.relative(this.directory, filePath)));
    });
  }

  /**
   * Add a MockFile to the repository.
   *
   * @param {object} MockFileObj
   */
  addMock(MockFileObj) {
    const key = MockFileObj.getKey();
    const mockFilePath = MockFileObj.getFilePath();

    if (!this.mocks.has(key)) {
      this.mocks.set(key, [mockFilePath]);
    } else if (!this.mocks.get(key).includes(mockFilePath)) {
      this.mocks.get(key).push(mockFilePath);
    }
  }

  async findByRequest(Request) {
    if (this.watch) this.readMocks();

    const keyRequest = this.getFileKeyByRequest(Request);
    const keyOverride = `${keyRequest.slice(0, -9)}${KEY_OVERRIDE}`;
    const key = this.mocks.has(keyOverride) ? keyOverride : keyRequest;

    return new Promise((resolve, reject) => {
      if (this.mocks.has(key)) {
        const mockFilePath = this.mocks.get(key).shift(); // Take the first mock from the stack.
        const filePath = `${this.directory}${path.sep}${mockFilePath}`;
        this.mocks.get(key).push(mockFilePath); // Add the mock back to the end of the stack.
        const Response = new FileResponse(filePath);
        resolve({
          Response,
          mockPath: filePath,
        });
      } else {
        reject(`File not found`);
      }
    });
  }

  /**
   * Persist the RequestResponse.
   *
   * @param {object} RequestResponse
   * @return Promise
   */
  async save(RequestResponse) {
    const Request = RequestResponse.request;
    Request._hash = this.hash.request(Request);

    const Response = RequestResponse.response;
    Response._hash = this.hash.response(Response);

    await makeDir(this.getFilePathByRequest(Request));

    const fileName = `${Request.method}.${Request._hash}.${Response._hash}.json`;
    const filePath = `${this.getFilePathByRequest(Request)}${path.sep}${fileName}`;
    const data = JSON.stringify(RequestResponse, null, 2);

    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, data, (err) => {
        if (err) {
          reject(err);
        } else {
          const mock = new MockFile(path.relative(this.directory, filePath));
          this.addMock(mock);
          resolve(true);
        }
      });
    });
  }

  /**
   * Get the file path from the request.
   *
   * Trailing slashes are trimmed.
   *
   * @param Request
   * @returns {string}
   */
  getFilePathByRequest(Request) {
    const requestUrl = url.parse(Request.url, true);
    const requestDirectory = path.normalize(`${path.sep}${requestUrl.pathname}`);

    return path.normalize(`${this.directory}${path.sep}${requestDirectory}`).replace(RTRIM_SLASH, '');
  }

  /**
   * Get the file key from the request.
   *
   * This function has to be in sync with the `MockFile.getKey()` method!
   *
   * @param {object} Request
   * @returns {string}
   */
  getFileKeyByRequest(Request) {
    const requestUrl = url.parse(Request.url, true);
    const requestDirectory = path.normalize(`${path.sep}${requestUrl.pathname}`).replace(RTRIM_SLASH, '');
    const requestHash = this.hash.request(Request).substring(0, 9);

    return `${requestDirectory}${path.sep}${Request.method}.${requestHash}`;
  }
}
