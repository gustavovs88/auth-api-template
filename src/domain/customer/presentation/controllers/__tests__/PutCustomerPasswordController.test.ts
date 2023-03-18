import { mockCustomerService } from '@domain/customer/service/__mocks__/CustomerService.mock'
import { InternalServerError } from '@utils/exceptions/InternalServerError'
import { UnauthorizedError } from '@utils/exceptions/UnauthorizedError'
import { PutCustomerPasswordController } from '../PutCustomerPasswordController'

const mockRequest = {
  body: {
    password: 'any_password',
    resetPasswordToken: 'any_token',
  },
}

const mockEmptyTokenRequest = {
  body: {
    password: 'any_password',
  },
}
const customerService = new mockCustomerService()
const controller = new PutCustomerPasswordController(customerService)

describe('PutCustomerPasswordController', () => {
  it('should return 200 and correct response', async () => {
    const response = await controller.handle(mockRequest)
    expect(response).toStrictEqual(controller.ok({}))
  })
  it('should return unauthorized error if token is not provided', async () => {
    const response = await controller.handle(mockEmptyTokenRequest)
    expect(response).toStrictEqual(
      controller.error(
        new UnauthorizedError(
          'Link inválido. Favor acessar o link enviado no seu e-mail.'
        )
      )
    )
  })
  it('should return error if service fails', async () => {
    jest
      .spyOn(customerService, 'updatePassword')
      .mockRejectedValueOnce(new InternalServerError('any_error'))
    const response = await controller.handle(mockRequest)
    expect(response).toStrictEqual(
      controller.error(new InternalServerError('any_error'))
    )
  })
})
