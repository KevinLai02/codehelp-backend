import type { RESPONSE_CODE } from '~/types';

export default class FeatureError extends Error {
  serverStatus: number;
  code: RESPONSE_CODE;
  message: string;

  constructor(serverStatus: number, code: RESPONSE_CODE, message: string) {
    super();
    this.serverStatus = serverStatus;
    this.code = code;
    this.message = message;
  }
}
