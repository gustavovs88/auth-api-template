import { BaseError } from '@utils/exceptions/BaseError'

export class ForbiddenError extends BaseError {
  constructor(message: string) {
    super({ message, name: 'ForbiddenError', statusCode: 403 })
  }
}
