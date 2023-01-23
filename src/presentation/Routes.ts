import { controllerAdapter } from '@utils/controllerHelpers/ControllerAdapter'
import { CustomerRoutes } from '@domain/customer/presentation/CustomerRoutes'
import { Types } from '@di/types'
import { inject, injectable } from 'inversify'
import { Server } from '@infrastructure/application/Server'
import { AuthRoutes } from '@domain/authentication/presentation/AuthRoutes'
@injectable()
export class Routes {
  constructor(
    @inject(Types.Server) private server: Server,
    @inject(Types.CustomerRoutes) private customerRoutes: CustomerRoutes,
    @inject(Types.AuthRoutes) private authRoutes: AuthRoutes
  ) {}

  initRouter() {
    const router = this.server.router
    const get = [...this.authRoutes.get(), ...this.customerRoutes.get()]
    const post = [...this.authRoutes.post(), ...this.customerRoutes.post()]
    const put = [...this.customerRoutes.put()]

    get.forEach((route) => {
      router.get(route.path, controllerAdapter(route.controller))
    })
    post.forEach((route) => {
      router.post(route.path, controllerAdapter(route.controller))
    })
    put.forEach((route) => {
      router.put(route.path, controllerAdapter(route.controller))
    })
  }
}
