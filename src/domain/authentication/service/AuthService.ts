import { Types } from '@di/types'
import { inject, injectable } from 'inversify'
import { validateHash } from '@utils/encryption/Hash'
import { CustomerService } from '@domain/customer/service/CustomerService'
import { ForbiddenError } from '@utils/exceptions/ForbiddenError'
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
    if (!isCredentialsValid) throw new ForbiddenError('Credentials not valid')
    const accessToken = JWT.sign(
      {
        customerId: customer?.id,
      },
      tokenSecret,
      { expiresIn: '2m' }
    )
    const refreshToken = JWT.sign(
      {
        customerId: customer?.id,
      },
      refreshTokenSecret,
      { expiresIn: '1d' }
    )
    return { accessToken, refreshToken }
  }

  async refreshSession(refreshToken: string) {
    const { tokenSecret, refreshTokenSecret } = this.config.get()
    try {
      const decoded = JWT.verify(refreshToken, refreshTokenSecret) as JwtPayload
      const accessToken = JWT.sign(
        {
          customerId: decoded.customerId,
        },
        tokenSecret,
        { expiresIn: '2m' }
      )
      const refresh = JWT.sign(
        {
          customerId: decoded.customerId,
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
      throw new ForbiddenError('Reset password link has expired')
    }
  }
}
