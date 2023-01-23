import { Types } from '@di/types'
import { CustomerService } from '@domain/customer/service/CustomerService'
import { BaseController } from '@utils/controllerHelpers/BaseController'
import {
  HttpRequest,
  HttpResponse,
} from '@utils/controllerHelpers/types/IController'
import { BaseError } from '@utils/exceptions/BaseError'
import { ForbiddenError } from '@utils/exceptions/ForbiddenError'
import { inject, injectable } from 'inversify'

@injectable()
export class PutCustomerPasswordController extends BaseController {
  constructor(
    @inject(Types.CustomerService) private customerService: CustomerService
  ) {
    super()
  }
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const resetPasswordToken = httpRequest.cookies?.resetPasswordToken
    try {
      try {
        if (!resetPasswordToken) {
          throw new ForbiddenError('Reset password Token not provided')
        }
        const { password } = httpRequest.body
        const customer = await this.customerService.updatePassword(
          resetPasswordToken,
          password
        )
        return this.ok({ customer })
      } catch (error) {
        return this.error(error as BaseError)
      }
    } catch (error) {
      return this.error(error as BaseError)
    }
  }
}
