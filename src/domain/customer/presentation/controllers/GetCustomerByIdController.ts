import { Types } from '@di/types'
import { ICustomerService } from '@domain/customer/types/ICustomer'
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
    @inject(Types.CustomerService) private customerService: ICustomerService
  ) {
    super()
  }
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { customerId } = httpRequest.params
    try {
      const customer = await this.customerService.getById(customerId)
      if (!customer) throw new NotFoundError('Cliente não encontrado.')
      return this.ok(customer)
    } catch (error) {
      return this.error(error as BaseError)
    }
  }
}
