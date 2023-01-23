import { Types } from '@di/types'
import { CustomerService } from '@domain/customer/service/CustomerService'
import { BaseController } from '@utils/controllerHelpers/BaseController'
import {
  HttpRequest,
  HttpResponse,
} from '@utils/controllerHelpers/types/IController'
import { BaseError } from '@utils/exceptions/BaseError'
import { NotFoundError } from '@utils/exceptions/NotFoundError'
import { inject, injectable } from 'inversify'

@injectable()
export class GetCustomerByIdController extends BaseController {
  constructor(
    @inject(Types.CustomerService) private customerService: CustomerService
  ) {
    super()
  }
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { customerId } = httpRequest.params
    try {
      const customer = await this.customerService.getById(customerId)
      if (!customer) throw new NotFoundError('Customer not found')
      return this.ok(customer)
    } catch (error) {
      return this.error(error as BaseError)
    }
  }
}
