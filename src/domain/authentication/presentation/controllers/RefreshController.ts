import { Types } from '@di/types'
import { AuthService } from '@domain/authentication/service/AuthService'
import { BaseController } from '@utils/controllerHelpers/BaseController'
import {
  HttpRequest,
  HttpResponse,
} from '@utils/controllerHelpers/types/IController'
import { times } from '@utils/datesAndTimes/timesConstants'
import { BaseError } from '@utils/exceptions/BaseError'
import { UnauthorizedError } from '@utils/exceptions/UnauthorizedError'
import { inject, injectable } from 'inversify'

@injectable()
export class RefreshController extends BaseController {
  constructor(@inject(Types.AuthService) private authService: AuthService) {
    super()
  }

  async handle(
    httpRequest: HttpRequest,
    httpResponse: HttpResponse
  ): Promise<HttpResponse> {
    const refreshToken = httpRequest.cookies?.refreshToken
    try {
      try {
        if (!refreshToken) {
          throw new UnauthorizedError('Refresh Token not provided')
        }
        const tokens = await this.authService.refreshSession(refreshToken)
        httpResponse.cookie('refreshToken', tokens.refresh, {
          httpOnly: true,
          sameSite: 'None',
          secure: true,
          maxAge: times['2_DAYS'],
        })
        return this.ok({ accessToken: tokens.accessToken })
      } catch (error) {
        return this.error(error as BaseError)
      }
    } catch (error) {
      return this.error(error as BaseError)
    }
  }
}
