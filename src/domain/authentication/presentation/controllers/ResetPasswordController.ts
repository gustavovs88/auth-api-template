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
export class ResetPasswordController extends BaseController {
  constructor(@inject(Types.AuthService) private authService: AuthService) {
    super()
  }

  async handle(
    httpRequest: HttpRequest,
    httpResponse: HttpResponse
  ): Promise<HttpResponse> {
    try {
      const { email } = httpRequest.body
      const token = await this.authService.resetPassword(email)
      httpResponse.cookie('resetPasswordToken', token, {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
        maxAge: times['1_DAY'],
      })

      return this.ok({})
    } catch (error) {
      return this.error(error as BaseError)
    }
  }
}
