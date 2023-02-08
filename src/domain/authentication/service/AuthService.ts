import { Types } from '@di/types'
import { inject, injectable } from 'inversify'
import { validateHash } from '@utils/encryption/Hash'
import { CustomerService } from '@domain/customer/service/CustomerService'
import JWT, { JwtPayload } from 'jsonwebtoken'
import { IConfig } from '@config/types/IConfig'
import { UnauthorizedError } from '@utils/exceptions/UnauthorizedError'
import { SendEmailProducer } from '@domain/email/service/SendEmailProducer'
import {
  ETemplateDomain,
  ETemplateName,
} from '@domain/email/service/ITemplateFactory'

@injectable()
export class AuthService {
  constructor(
    @inject(Types.CustomerService)
    private customerService: CustomerService,
    @inject(Types.SendEmailProducer)
    private emailProducer: SendEmailProducer,
    @inject(Types.Config) private config: IConfig
  ) {}
  async login(email: string, password: string) {
    const customer = await this.customerService.getByEmail(email)
    const { tokenSecret, refreshTokenSecret } = this.config.get()

    const isCredentialsValid = await validateHash(password, customer?.password)
    if (!isCredentialsValid)
      throw new UnauthorizedError('E-mail ou senha inválidos.')
    const accessToken = JWT.sign(
      {
        customerId: customer?.id,
        customerName: customer?.name,
        customerEmail: customer?.email,
      },
      tokenSecret,
      { expiresIn: '2m' }
    )
    const refreshToken = JWT.sign(
      {
        customerId: customer?.id,
        customerName: customer?.name,
        customerEmail: customer?.email,
      },
      refreshTokenSecret,
      { expiresIn: '1d' }
    )
    return { accessToken, refreshToken, customer }
  }

  async refreshSession(refreshToken: string) {
    const { tokenSecret, refreshTokenSecret } = this.config.get()
    try {
      const decoded = JWT.verify(refreshToken, refreshTokenSecret) as JwtPayload
      const accessToken = JWT.sign(
        {
          customerId: decoded.customerId,
          customerName: decoded?.customerName,
          customerEmail: decoded?.customerEmail,
        },
        tokenSecret,
        { expiresIn: '2m' }
      )
      const refresh = JWT.sign(
        {
          customerId: decoded.customerId,
          customerName: decoded?.customerName,
          customerEmail: decoded?.customerEmail,
        },
        refreshTokenSecret,
        { expiresIn: '2d' }
      )
      return { accessToken, refresh }
    } catch (error) {
      throw new UnauthorizedError('Invalid refresh token')
    }
  }

  async resetPassword(email: string) {
    const customer = await this.customerService.getByEmail(email)
    const { adminEmail, refreshTokenSecret, webDomain } = this.config.get()
    const token = JWT.sign(
      {
        customerId: customer?.id,
        customerName: customer?.name,
      },
      refreshTokenSecret,
      { expiresIn: '1d' }
    )
    const link = `${webDomain}/app/reset-password?token=${token}`
    const subject = 'Resetei - Alteração de senha'
    const properties = {
      email,
      fromEmail: adminEmail,
      subject,
      link,
      name: customer?.name,
      templateName: ETemplateName.ResetPassword,
      templateDomain: ETemplateDomain.Application,
    }
    await this.emailProducer.send(properties)
    return token
  }

  async validateLink(token: string) {
    const { refreshTokenSecret } = this.config.get()
    try {
      JWT.verify(token, refreshTokenSecret) as JwtPayload
    } catch (error) {
      throw new UnauthorizedError('Reset password link has expired')
    }
  }
}
