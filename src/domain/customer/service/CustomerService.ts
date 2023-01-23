import { Types } from '@di/types'
import { inject, injectable } from 'inversify'
import { ICustomer, ICustomerResponse } from '../types/ICustomer'
import { hash } from '@utils/encryption/Hash'
import { ICustomerRepository } from '../repository/ICustomerRepository'
import { ForbiddenError } from '@utils/exceptions/ForbiddenError'
import JWT, { JwtPayload } from 'jsonwebtoken'
import { IConfig } from '@config/types/IConfig'

@injectable()
export class CustomerService {
  constructor(
    @inject(Types.CustomerRepository)
    private customerRepository: ICustomerRepository,
    @inject(Types.Config) private config: IConfig
  ) {}
  async create(params: ICustomer): Promise<ICustomerResponse> {
    params.password = await hash(params.password)
    const isEmailAvailable = !Boolean(
      await this.customerRepository.getByEmail(params.email)
    )
    if (isEmailAvailable) {
      const customerInserted = await this.customerRepository.insert(params)
      delete customerInserted.password
      return customerInserted
    }
    throw new ForbiddenError('Email already registered')
  }

  async getById(customerId: string): Promise<ICustomerResponse | undefined> {
    return this.customerRepository.getById(customerId)
  }

  async getByEmail(
    customerEmail: string
  ): Promise<ICustomerResponse | undefined> {
    return this.customerRepository.getByEmail(customerEmail)
  }

  async updatePassword(
    token: string,
    newPassword: string
  ): Promise<ICustomerResponse | undefined> {
    try {
      const { refreshTokenSecret } = this.config.get()
      const decoded = JWT.verify(token, refreshTokenSecret) as JwtPayload
      const password = await hash(newPassword)
      return this.customerRepository.updatePassword(
        decoded.customerId,
        password
      )
    } catch (error) {
      throw new ForbiddenError('Invalid Token')
    }
  }
}
