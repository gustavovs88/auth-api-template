import { BaseError } from '@utils/exceptions/BaseError'

export class InternalServerError extends BaseError {
  constructor(message: string) {
    super({ message, name: 'InternalServerError', statusCode: 500 })
  }
}
