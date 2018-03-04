require = require('@std/esm')(module);

const hash = require('../../utils/hash').default;

test('It hashes an object', () => {
  const obj = { test: 'foo' };
  expect(hash(obj)).toBe('d39c2c95');
});

test('It hashes a string', () => {
  const str = 'some random value';
  expect(hash(str)).toBe('2b888fc3');
});
