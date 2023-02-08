import { BaseController } from '@utils/controllerHelpers/BaseController'
import {
  HttpRequest,
  HttpResponse,
} from '@utils/controllerHelpers/types/IController'
import { BaseError } from '@utils/exceptions/BaseError'
import { injectable } from 'inversify'

@injectable()
export class LogoutController extends BaseController {
  async handle(
    _httpRequest: HttpRequest,
    httpResponse: HttpResponse
  ): Promise<HttpResponse> {
    try {
      httpResponse.cookie('refreshToken', '', {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
        expires: new Date(1970, 1, 1),
      })
      return this.ok({})
    } catch (error) {
      return this.error(error as BaseError)
    }
  }
}
