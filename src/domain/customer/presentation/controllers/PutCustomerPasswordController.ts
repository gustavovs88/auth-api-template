import { Types } from '@di/types'
import { ICustomerService } from '@domain/customer/types/ICustomer'
import { BaseController } from '@utils/controllerHelpers/BaseController'
import {
  HttpRequest,
  HttpResponse,
} from '@utils/controllerHelpers/types/IController'
import { BaseError } from '@utils/exceptions/BaseError'
import { UnauthorizedError } from '@utils/exceptions/UnauthorizedError'
import { inject, injectable } from 'inversify'

@injectable()
export class PutCustomerPasswordController extends BaseController {
  constructor(
    @inject(Types.CustomerService) private customerService: ICustomerService
  ) {
    super()
  }
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { password, resetPasswordToken } = httpRequest.body
    try {
      if (!resetPasswordToken) {
        throw new UnauthorizedError(
          'Link inválido. Favor acessar o link enviado no seu e-mail.'
        )
      }
      await this.customerService.updatePassword(resetPasswordToken, password)
      return this.ok({})
    } catch (error) {
      return this.error(error as BaseError)
    }
  }
}
