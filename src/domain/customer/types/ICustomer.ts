import { ResponseMetadata } from '@aws-sdk/types/dist-types/response'

export interface ICustomerParams {
  name: string
  email: string
  password: string
}

export interface ICustomerResponse {
  id: string
  name: string
  email: string
  password?: string
}

export interface ICustomerDbResponse {
  $metadata: ResponseMetadata
  Item?: ICustomerResponse
  Items?: ICustomerResponse[]
}

export interface ICustomerService {
  create(params: ICustomerParams): Promise<ICustomerResponse>
  getById(customerId: string): Promise<ICustomerResponse | undefined>
  getByEmail(customerEmail: string): Promise<ICustomerResponse | undefined>
  updatePassword(token: string, newPassword: string): Promise<{} | undefined>
}

export interface ICustomerRepository {
  insert(params: ICustomerParams): Promise<ICustomerResponse>
  getById(customerId: string): Promise<ICustomerResponse | undefined>
  getByEmail(customerEmail: string): Promise<ICustomerResponse | undefined>
  updatePassword(
    customerId: string,
    newPassword: string
  ): Promise<ICustomerResponse | undefined>
}
