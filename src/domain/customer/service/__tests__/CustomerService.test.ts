import { Config } from '@config/Config'
import { mockCustomerRepository } from '@domain/customer/repository/__mocks__/CustomerRepository.mock'
import { CustomerService } from '@domain/customer/service/CustomerService'
import {
  mockCreateCustomerParams,
  mockCustomerResponse,
} from '@domain/customer/service/__mocks__/CustomerService.mock'
import { InternalServerError } from '@utils/exceptions/InternalServerError'
import { UnauthorizedError } from '@utils/exceptions/UnauthorizedError'
import JWT from 'jsonwebtoken'

describe('CustomerService', () => {
  const customerRepository = new mockCustomerRepository()

  const service = new CustomerService(customerRepository, new Config())
  describe('create', () => {
    it('should create a customer correctly', async () => {
      jest
        .spyOn(customerRepository, 'getByEmail')
        .mockResolvedValueOnce(undefined)
      const customer = await service.create(mockCreateCustomerParams)

      expect(customer).toEqual(mockCustomerResponse)
    })
    it('should throw unauthorized error if email exists on db', async () => {
      const promise = service.create(mockCreateCustomerParams)

      await expect(promise).rejects.toThrow(
        new UnauthorizedError('Email already registered')
      )
    })
  })

  describe('getById', () => {
    it('should return correct value', async () => {
      const customer = await service.getById('any_customer_id')

      expect(customer).toEqual(mockCustomerResponse)
    })
  })

  describe('getByEmail', () => {
    it('should return correct value', async () => {
      const customer = await service.getById('any_email@domain.com')

      expect(customer).toEqual(mockCustomerResponse)
    })
  })

  describe('updatePassword', () => {
    it('should correct value if token is valid', async () => {
      jest
        .spyOn(JWT, 'verify')
        .mockResolvedValueOnce({ customerId: 'any_customer_id' } as never)
      const customer = await service.updatePassword(
        'any_token',
        'any_email@domain.com'
      )

      expect(customer).toEqual(mockCustomerResponse)
    })

    it('should throw unauthorized error if token is invalid', async () => {
      const promise = service.updatePassword(
        'any_token',
        'any_email@domain.com'
      )

      await expect(promise).rejects.toThrow(
        new UnauthorizedError('Link expirado ou inválido')
      )
    })

    it('should throw internal server error if repository fails', async () => {
      jest
        .spyOn(JWT, 'verify')
        .mockResolvedValueOnce({ customerId: 'any_customer_id' } as never)

      jest
        .spyOn(customerRepository, 'updatePassword')
        .mockRejectedValueOnce(new Error('any_error'))

      const promise = service.updatePassword(
        'any_token',
        'any_email@domain.com'
      )

      await expect(promise).rejects.toThrow(
        new InternalServerError('Tivemos um problema ao atualizar sua senha.')
      )
    })
  })
})
