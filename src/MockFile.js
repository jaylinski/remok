import path from 'path';

export default class MockFile {
  /**
   * @param {string} filePath
   */
  constructor(filePath) {
    this.filePath = filePath;
  }

  getFilePath() {
    return this.filePath;
  }

  /**
   * Extract the method from the file path.
   *
   * @returns {string}
   */
  getMethod() {
    const file = path.parse(this.filePath);

    return file.name.substr(0, file.name.indexOf('.'));
  }

  /**
   * Extract the request hash from the file path.
   *
   * @returns {string}
   */
  getRequestHash() {
    const file = path.parse(this.filePath);
    const requestHashStart = file.base.indexOf('.') + 1;
    const requestHashEnd = file.base.indexOf('.', requestHashStart);

    return file.base.substr(requestHashStart, requestHashEnd - requestHashStart);
  }

  /**
   * Get the file key from the file path.
   *
   * This function has to be in sync with the `Repository.getFileKeyByRequest()` method!
   *
   * @returns {string}
   */
  getKey() {
    const file = path.parse(this.filePath);
    const method = this.getMethod();
    const requestHash = this.getRequestHash();

    return path.normalize(`${path.sep}${file.dir}${path.sep}${method}.${requestHash}`);
  }
}
