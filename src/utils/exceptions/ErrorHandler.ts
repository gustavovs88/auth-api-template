import { Logger } from '@infrastructure/logger/Logger'
import { BaseError } from '@utils/exceptions/BaseError'
import { InternalServerError } from '@utils/exceptions/InternalServerError'

export function errorHandler(err: BaseError, _req: any, res: any, _next: any) {
  const logger = new Logger()

  if (!err.customError) {
    err = new InternalServerError(err.message)
  }

  const errorMessage = err.getErrorMessage()
  logger.error(JSON.stringify(errorMessage))

  return res.status(err.statusCode).send(errorMessage)
}
