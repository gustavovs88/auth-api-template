import { ICustomer, ICustomerResponse } from '../types/ICustomer'

export interface ICustomerRepository {
  insert(params: ICustomer): Promise<ICustomerResponse>
  getById(customerId: string): Promise<ICustomerResponse | undefined>
  getByEmail(customerEmail: string): Promise<ICustomerResponse | undefined>
  updatePassword(
    customerId: string,
    newPassword: string
  ): Promise<ICustomerResponse | undefined>
}
