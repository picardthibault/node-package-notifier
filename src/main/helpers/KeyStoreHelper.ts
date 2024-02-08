import * as crypto from 'crypto';

export const generateKey = (): string => {
  return crypto.randomUUID();
};
