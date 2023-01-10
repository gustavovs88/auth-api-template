import { controllerAdapter } from '@utils/ControllerHelpers/ControllerAdapter'
import { Router } from 'express'
import { GetCustomerController } from '../domain/customer/presentation/controllers/GetCustomerController'

export class Routes {
  private router
  constructor(router: Router) {
    this.router = router
  }
  private get = [
    {
      path: '/getCustomer',
      controller: new GetCustomerController(),
    },
  ]
  initRouter() {
    this.get.forEach((route) => {
      this.router.get(route.path, controllerAdapter(route.controller))
    })
  }
}
