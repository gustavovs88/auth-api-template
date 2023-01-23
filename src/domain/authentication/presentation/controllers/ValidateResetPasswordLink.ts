import { Types } from '@di/types'
import { AuthService } from '@domain/authentication/service/AuthService'
import { BaseController } from '@utils/controllerHelpers/BaseController'
import {
  HttpRequest,
  HttpResponse,
} from '@utils/controllerHelpers/types/IController'
import { BaseError } from '@utils/exceptions/BaseError'
import { inject, injectable } from 'inversify'

@injectable()
export class ValidateResetPasswordLinkController extends BaseController {
  constructor(@inject(Types.AuthService) private authService: AuthService) {
    super()
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { token } = httpRequest.query
      await this.authService.validateLink(token)
      return this.ok({})
    } catch (error) {
      return this.error(error as BaseError)
    }
  }
}
