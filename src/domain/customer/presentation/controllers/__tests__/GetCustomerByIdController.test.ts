import {
  mockCustomerResponse,
  mockCustomerService,
} from '@domain/customer/service/__mocks__/CustomerService.mock'
import { InternalServerError } from '@utils/exceptions/InternalServerError'
import { GetCustomerByIdController } from '@domain/customer/presentation/controllers/GetCustomerByIdController'
import { NotFoundError } from '@utils/exceptions/NotFoundError'

const mockRequest = {
  params: { customerId: 'any_customer_id' },
}
const customerService = new mockCustomerService()
const controller = new GetCustomerByIdController(customerService)

describe('GetCustomerByIdController', () => {
  it('should return 200 and correct response', async () => {
    const response = await controller.handle(mockRequest)
    expect(response).toStrictEqual(controller.ok(mockCustomerResponse))
  })
  it('should call service with correct params', async () => {
    const spyOnGetById = jest.spyOn(customerService, 'getById')
    await controller.handle(mockRequest)
    expect(spyOnGetById).toHaveBeenCalledWith('any_customer_id')
  })
  it('should return not found error if customer is not found', async () => {
    jest.spyOn(customerService, 'getById').mockResolvedValueOnce(undefined)
    const response = await controller.handle(mockRequest)
    expect(response).toStrictEqual(
      controller.error(new NotFoundError('Cliente não encontrado.'))
    )
  })
  it('should return error if service fails', async () => {
    jest
      .spyOn(customerService, 'getById')
      .mockRejectedValueOnce(new InternalServerError('any_error'))
    const response = await controller.handle(mockRequest)
    expect(response).toStrictEqual(
      controller.error(new InternalServerError('any_error'))
    )
  })
})
