import { controllerAdapter } from '@utils/ControllerHelpers/ControllerAdapter'
import { CustomerRoutes } from '@domain/customer/presentation/CustomerRoutes'
import { Types } from '@di/types'
import { inject, injectable } from 'inversify'
import { Server } from '@infrastructure/application/Server'
@injectable()
export class Routes {
  constructor(
    @inject(Types.Server) private server: Server,
    @inject(Types.CustomerRoutes) private customerRoutes: CustomerRoutes
  ) {}

  initRouter() {
    const router = this.server.router
    const get = [...this.customerRoutes.get()]
    get.forEach((route) => {
      router.get(route.path, controllerAdapter(route.controller))
    })
  }
}
