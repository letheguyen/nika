export const REGEX_VALIDATOR = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@relipasoft\.com$/,
};

export enum Role {
  User = 'user',
  Admin = 'admin',
}

export enum USER_STATUS {
  VERIFIED = 0,
  BLOCKED = 1,
}

export const DEFAULT_USER_NONCE = 1;

export const defaultSelectFields = '-__v -password';
