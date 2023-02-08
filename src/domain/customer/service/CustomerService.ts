import { Types } from '@di/types'
import { inject, injectable } from 'inversify'
import {
  ICustomerParams,
  ICustomerRepository,
  ICustomerResponse,
  ICustomerService,
} from '@domain/customer/types/ICustomer'
import { hash } from '@utils/encryption/Hash'
import { UnauthorizedError } from '@utils/exceptions/UnauthorizedError'
import JWT, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken'
import { IConfig } from '@config/types/IConfig'
import { InternalServerError } from '@utils/exceptions/InternalServerError'

@injectable()
export class CustomerService implements ICustomerService {
  constructor(
    @inject(Types.CustomerRepository)
    private customerRepository: ICustomerRepository,
    @inject(Types.Config) private config: IConfig
  ) {}
  async create(params: ICustomerParams): Promise<ICustomerResponse> {
    params.password = await hash(params.password)
    const isEmailAvailable = !Boolean(
      await this.customerRepository.getByEmail(params.email)
    )
    if (isEmailAvailable) {
      const customerInserted = await this.customerRepository.insert(params)
      delete customerInserted.password
      return customerInserted
    }
    throw new UnauthorizedError('Email already registered')
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
      console.log(error)
      if (error instanceof JsonWebTokenError)
        throw new UnauthorizedError('Link expirado ou inválido')
      throw new InternalServerError(
        'Tivemos um problema ao atualizar sua senha.'
      )
    }
  }
}
