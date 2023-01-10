import {
  HttpRequest,
  HttpResponse,
} from '@utils/ControllerHelpers/types/IController'
import { BaseError } from '@utils/Error/BaseError'
import { InternalServerError } from '@utils/Error/InternalServerError'

export interface IController {
  handle(httpRequest: HttpRequest): Promise<HttpResponse>
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

export abstract class BaseController implements IController {
  abstract handle(httpRequest: HttpRequest): Promise<HttpResponse>

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
