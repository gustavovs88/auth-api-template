import { BaseController } from '@utils/ControllerHelpers/BaseController'
import {
  HttpRequest,
  HttpResponse,
} from '@utils/ControllerHelpers/types/IController'
import { injectable } from 'inversify'
import { IGetCustomerController } from './types/IGetCustomerController'

@injectable()
export class GetCustomerController
  extends BaseController
  implements IGetCustomerController
{
  async handle(_httpRequest: HttpRequest): Promise<HttpResponse> {
    return this.ok({ response: 'Resposta do cliente' })
  }
}
