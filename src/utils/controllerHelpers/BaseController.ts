import {
  HttpRequest,
  HttpResponse,
} from '@utils/controllerHelpers/types/IController'
import { BaseError } from '@utils/exceptions/BaseError'
import { InternalServerError } from '@utils/exceptions/InternalServerError'
import { controller } from 'inversify-express-utils'

export interface IController {
  handle(
    httpRequest: HttpRequest,
    httpResponse?: HttpResponse
  ): Promise<HttpResponse>
  ok(data: OkResponse): HttpResponse
  error(error: BaseError): HttpResponse
}

type OkResponse = {
  [key: string]: any
}

type CustomResponse = {
  statusCode: number
  [key: string]: any
}
@controller('/')
export abstract class BaseController implements IController {
  abstract handle(
    httpRequest: HttpRequest,
    httpResponse?: HttpResponse
  ): Promise<HttpResponse>

  ok(data: OkResponse): HttpResponse {
    return {
      data: data,
    }
  }

  sendWithStatus(response: CustomResponse): HttpResponse {
    return {
      statusCode: response.statusCode,
      data: response.data,
    }
  }

  error(error: BaseError): HttpResponse {
    if (!error.customError) error = new InternalServerError(error.message)
    return {
      error: {
        code: error.statusCode,
        message: {
          value: error.name,
          formatted: error.message,
        },
      },
    }
  }
}
