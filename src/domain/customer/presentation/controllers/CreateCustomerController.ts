import { Types } from '@di/types'
import { ICustomerService } from '@domain/customer/types/ICustomer'
import { BaseController } from '@utils/controllerHelpers/BaseController'
import {
  HttpRequest,
  HttpResponse,
} from '@utils/controllerHelpers/types/IController'
import { BaseError } from '@utils/exceptions/BaseError'
import { inject, injectable } from 'inversify'

@injectable()
export class CreateCustomerController extends BaseController {
  constructor(
    @inject(Types.CustomerService) private customerService: ICustomerService
  ) {
    super()
  }
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const params = httpRequest.body
    try {
      const customer = await this.customerService.create(params)
      return this.ok(customer)
    } catch (error) {
      return this.error(error as BaseError)
    }
  }
}
