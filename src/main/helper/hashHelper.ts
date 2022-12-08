import * as crypto from 'crypto';

export function getSha1(value: string): string {
  const digestBuilder = crypto.createHash('sha1');
  digestBuilder.update(value);
  return digestBuilder.digest().toString('hex');
}
