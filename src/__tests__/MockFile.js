require = require('@std/esm')(module);

const MockFile = require('../MockFile').default;

describe('MockFile', () => {
  test('It should extract the override key from the file path', async () => {
    const manualMock = new MockFile('foo/bar/GET.@override.json');

    expect(manualMock.getRequestHash()).toBe('@override');
  });

  test('It should extract the request hash from the file path', async () => {
    const recordedMock = new MockFile('foo/bar/GET.requesthash.responsehash.json');

    expect(recordedMock.getRequestHash()).toBe('requesthash');
  });
});
