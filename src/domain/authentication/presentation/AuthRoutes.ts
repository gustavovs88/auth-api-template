import { inject, injectable } from 'inversify'
import { IRoutes } from '@presentation/types/IRoutes'
import { Types } from '@di/types'
import { RefreshController } from '@domain/authentication/presentation/controllers/RefreshController'
import { LoginController } from '@domain/authentication/presentation/controllers/LoginController'
import { ResetPasswordController } from '@domain/authentication/presentation/controllers/ResetPasswordController'
import { ValidateResetPasswordLinkController } from './controllers/ValidateResetPasswordLink'
@injectable()
export class AuthRoutes {
  constructor(
    @inject(Types.LoginController)
    private loginController: LoginController,
    @inject(Types.RefreshController)
    private refreshController: RefreshController,
    @inject(Types.ResetPasswordController)
    private resetPassController: ResetPasswordController,
    @inject(Types.ValidateResetPasswordLinkController)
    private validateResetPasswordLinkController: ValidateResetPasswordLinkController
  ) {}

  private postRoutes: IRoutes[] = [
    {
      path: '/api/v1/auth/login',
      controller: this.loginController,
    },
    {
      path: '/api/v1/auth/refresh',
      controller: this.refreshController,
    },
    {
      path: '/api/v1/auth/resetPassword',
      controller: this.resetPassController,
    },
  ]

  private getRoutes: IRoutes[] = [
    {
      path: '/api/v1/auth/resetPassword/validateLink',
      controller: this.validateResetPasswordLinkController,
    },
  ]

  public post() {
    return this.postRoutes
  }

  public get() {
    return this.getRoutes
  }
}
