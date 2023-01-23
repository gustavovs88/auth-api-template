import { BaseError } from '@utils/exceptions/BaseError'

export class NotFoundError extends BaseError {
  constructor(message: string) {
    super({ message, name: 'NotFoundError', statusCode: 404 })
  }
}
