import { mockCustomerResponse } from '@domain/customer/service/__mocks__/CustomerService.mock'
import {
  ICustomerDbResponse,
  ICustomerRepository,
  ICustomerResponse,
} from '@domain/customer/types/ICustomer'

export const mockCustomerDbResponse: ICustomerDbResponse = {
  $metadata: {
    httpStatusCode: 200,
    requestId: 'R8OJU6P0544TBHB469QBF6I7E3VV4KQNSO5AEMVJF66Q9ASUAAJG',
    extendedRequestId: undefined,
    cfId: undefined,
    attempts: 1,
    totalRetryDelay: 0,
  },
  Item: mockCustomerResponse,
}

export class mockCustomerRepository implements ICustomerRepository {
  async insert(): Promise<ICustomerResponse> {
    return mockCustomerResponse
  }
  async getById(): Promise<ICustomerResponse | undefined> {
    return mockCustomerResponse
  }
  async getByEmail(): Promise<ICustomerResponse | undefined> {
    return mockCustomerResponse
  }
  async updatePassword(): Promise<ICustomerResponse | undefined> {
    return mockCustomerResponse
  }
}
