import { injectable } from 'inversify'
import pino, { BaseLogger } from 'pino'
import { ILogger } from './ILogger'
@injectable()
export class Logger implements ILogger {
  private logger: BaseLogger
  constructor() {
    this.logger = pino()
  }
  info(message: string) {
    this.logger.info(message)
  }
  error(message: string) {
    this.logger.error(message)
  }
}
