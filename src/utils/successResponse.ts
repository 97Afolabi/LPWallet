import { Logger } from '@nestjs/common';

const AppLogger = new Logger();

export class SuccessResponse {
  message: string;
  data: unknown;

  constructor(message = 'successful', data: unknown = null) {
    this.message = message;
    this.data = data;
  }

  toJSON() {
    AppLogger.log(`(LOGS) Success - ${this.message}`);

    if (this.data) {
      return {
        status: 'success',
        message: this.message,
        data: this.data,
      };
    }

    return {
      status: 'success',
      message: this.message,
    };
  }
}
