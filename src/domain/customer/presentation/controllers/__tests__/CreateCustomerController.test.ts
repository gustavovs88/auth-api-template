import {
  mockCustomerResponse,
  mockCustomerService,
} from '@domain/customer/service/__mocks__/CustomerService.mock'
import { InternalServerError } from '@utils/exceptions/InternalServerError'
import { CreateCustomerController } from '@domain/customer/presentation/controllers/CreateCustomerController'

const mockRequest = {
  body: mockCustomerResponse,
}
const customerService = new mockCustomerService()
const controller = new CreateCustomerController(customerService)

describe('CreateCustomerController', () => {
  it('should return 200 and correct response', async () => {
    const response = await controller.handle(mockRequest)
    expect(response).toStrictEqual(controller.ok(mockCustomerResponse))
  })

  it('should return error if service fails', async () => {
    jest
      .spyOn(customerService, 'create')
      .mockRejectedValueOnce(new InternalServerError('any_error'))
    const response = await controller.handle(mockRequest)
    expect(response).toStrictEqual(
      controller.error(new InternalServerError('any_error'))
    )
  })
})
