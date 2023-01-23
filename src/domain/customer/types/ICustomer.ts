import { ResponseMetadata } from '@aws-sdk/types/dist-types/response'

export interface ICustomer {
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
