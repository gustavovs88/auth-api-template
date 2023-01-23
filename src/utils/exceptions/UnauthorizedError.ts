import { BaseError } from '@utils/exceptions/BaseError'

export class UnauthorizedError extends BaseError {
  constructor(message: string) {
    super({ message, name: 'Unauthorized', statusCode: 401 })
  }
}
