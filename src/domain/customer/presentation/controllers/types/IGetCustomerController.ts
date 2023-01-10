import {
  HttpRequest,
  HttpResponse,
} from '@utils/ControllerHelpers/types/IController'

export interface IGetCustomerController {
  handle(_httpRequest: HttpRequest): Promise<HttpResponse>
}
