import {
  mockCreateCustomerParams,
  mockCustomerResponse,
} from '@domain/customer/service/__mocks__/CustomerService.mock'
import { Logger } from '@infrastructure/logger/Logger'
import { CustomerRepository } from '../CustomerRepository'
import { dynamoDBDocClient } from '@infrastructure/database/client/DynamoDBClient'
import { ICustomerResponse } from '@domain/customer/types/ICustomer'
import { GetCommand } from '@aws-sdk/lib-dynamodb'
import { InternalServerError } from '@utils/exceptions/InternalServerError'

describe('CustomerService', () => {
  const logger = new Logger()
  const repository = new CustomerRepository(logger)
  jest.setTimeout(15000)
  jest.useFakeTimers({ advanceTimers: true })
  jest.setSystemTime(new Date(2023, 3, 18))
  afterAll(() => {
    dynamoDBDocClient.destroy
    jest.useRealTimers()
  })
  let customer = {} as ICustomerResponse
  describe('insert', () => {
    it('should insert a customer correctly', async () => {
      const response = await repository.insert(mockCreateCustomerParams)
      const customerId = response.id
      customer = Object.assign(mockCustomerResponse, { id: customerId })

      expect(response).toEqual({ ...customer, password: 'any_password' })
    })

    it('should throw InternalServerError and call logger', async () => {
      jest
        .spyOn(dynamoDBDocClient, 'send')
        .mockRejectedValueOnce(new Error('any_error') as never)
      const spyOnLogger = jest.spyOn(logger, 'error')

      const response = repository.insert(mockCreateCustomerParams)

      await expect(response).rejects.toThrow(
        new InternalServerError('Failed to create customer')
      )
      expect(spyOnLogger).toHaveBeenCalled()
    })
  })
  describe('getById', () => {
    it('should get a customer by its Id', async () => {
      const response = await repository.getById(customer.id)

      expect(response).toEqual(customer)
    })

    it('should throw InternalServerError and call logger', async () => {
      jest
        .spyOn(dynamoDBDocClient, 'send')
        .mockRejectedValueOnce(new Error('any_error') as never)
      const spyOnLogger = jest.spyOn(logger, 'error')

      const response = repository.getById(customer.id)

      await expect(response).rejects.toThrow(
        new InternalServerError('Failed to retrieve customer')
      )
      expect(spyOnLogger).toHaveBeenCalled()
    })
  })

  describe('getByEmail', () => {
    it('should get a customer by its email', async () => {
      const response = await repository.getByEmail(customer.email)

      expect(response).toEqual({ ...customer, password: 'any_password' })
    })

    it('should throw InternalServerError and call logger', async () => {
      jest
        .spyOn(dynamoDBDocClient, 'send')
        .mockRejectedValueOnce(new Error('any_error') as never)
      const spyOnLogger = jest.spyOn(logger, 'error')

      const response = repository.getByEmail(customer.email)

      await expect(response).rejects.toThrow(
        new InternalServerError('Failed to retrieve customer')
      )
      expect(spyOnLogger).toHaveBeenCalled()
    })
  })

  describe('updatePassword', () => {
    it('should update a customer password', async () => {
      await repository.updatePassword(customer.id, 'new_password')
      const getCustomer = await dynamoDBDocClient.send(
        new GetCommand({ TableName: 'customers', Key: { id: customer.id } })
      )

      expect(getCustomer.Item).toEqual({
        ...customer,
        password: 'new_password',
      })
    })

    it('should throw InternalServerError and call logger', async () => {
      jest
        .spyOn(dynamoDBDocClient, 'send')
        .mockRejectedValueOnce(new Error('any_error') as never)
      const spyOnLogger = jest.spyOn(logger, 'error')

      const response = repository.updatePassword(customer.id, 'new_password')

      await expect(response).rejects.toThrow(
        new InternalServerError('Failed to update customer password')
      )
      expect(spyOnLogger).toHaveBeenCalled()
    })
  })
})
