import crypto from 'crypto';

export default (data) => {
  const hash = crypto.createHash('sha256');
  hash.update(JSON.stringify(data));

  return hash.digest('hex');
};
