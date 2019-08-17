import * as pino from 'pino';

// TODO log persistence strategy
// TODO exit logging https://github.com/pinojs/pino/blob/HEAD/docs/help.md#exit-logging
export class Logger {
  private logger: pino.Logger;

  constructor(
    private prefix: string = '',
    prettyPrint: boolean = true,
    level: string = process.env.LEVEL || 'info'
  ) {
    const options: pino.LoggerOptions = { prettyPrint, level };
    this.logger = pino(options);
    this.debug('logger initialized', options);
  }

  public info = (message: string, ...args: any[]) => {
    this.logger.info(this.prefix, message, ...args);
  };

  public debug = (message: string, ...args: any[]) => {
    this.logger.debug(this.prefix, message, ...args);
  };

  public warn = (message: string, ...args: any[]) => {
    this.logger.warn(message, this.prefix, ...args);
  };

  public error = (message: string, ...args: any[]) => {
    this.logger.error(this.prefix, message, ...args);
  };
}
