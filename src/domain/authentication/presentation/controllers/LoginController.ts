import { Types } from '@di/types'
import { AuthService } from '@domain/authentication/service/AuthService'
import { BaseController } from '@utils/controllerHelpers/BaseController'
import {
  HttpRequest,
  HttpResponse,
} from '@utils/controllerHelpers/types/IController'
import { times } from '@utils/datesAndTimes/timesConstants'
import { BaseError } from '@utils/exceptions/BaseError'
import { inject, injectable } from 'inversify'

@injectable()
export class LoginController extends BaseController {
  constructor(@inject(Types.AuthService) private authService: AuthService) {
    super()
  }
  async handle(
    httpRequest: HttpRequest,
    httpResponse: HttpResponse
  ): Promise<HttpResponse> {
    const { email, password } = httpRequest.body
    try {
      const tokens = await this.authService.login(email, password)
      httpResponse.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
        maxAge: times['2_DAYS'],
      })
      return this.ok({ accessToken: tokens.accessToken })
    } catch (error) {
      return this.error(error as BaseError)
    }
  }
}
