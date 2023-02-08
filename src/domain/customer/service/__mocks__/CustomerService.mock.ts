import {
  ICustomerResponse,
  ICustomerService,
} from '@domain/customer/types/ICustomer'

export const mockCustomerResponse = {
  email: 'any_email@domain.com',
  name: 'John Doe',
  id: 'any_customer_id',
}

export class mockCustomerService implements ICustomerService {
  async create(): Promise<ICustomerResponse> {
    return mockCustomerResponse
  }
  async getById(): Promise<ICustomerResponse | undefined> {
    return mockCustomerResponse
  }
  async getByEmail(): Promise<ICustomerResponse> {
    return mockCustomerResponse
  }
  async updatePassword(): Promise<{}> {
    return {}
  }
}
