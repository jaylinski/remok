require = require('@std/esm')(module);

const hash = require('../../utils/hash').default;

test('It hashes an object', () => {
  const obj = { test: 'foo' };
  expect(hash(obj)).toBe('d39c2c9531fc4e475b3569a9f3c2071c453b982d0fc34a04830d124b7e7b61e9');
});

test('It hashes a string', () => {
  const str = 'some random value';
  expect(hash(str)).toBe('2b888fc35f95cfe9ab67340098673ad17054ca7124ebd2eecb23831b05b753e2');
});
