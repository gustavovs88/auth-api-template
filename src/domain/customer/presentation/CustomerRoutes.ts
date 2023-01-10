import { inject, injectable } from 'inversify'
import { IRoutes } from '@presentation/types/IRoutes'
import { Types } from '@di/types'
import { ICustomerRoutes } from './types/ICustomerRoutes'
import { GetCustomerController } from './controllers/GetCustomerController'

@injectable()
export class CustomerRoutes implements ICustomerRoutes {
  constructor(
    @inject(Types.GetCustomerController)
    private getCustomerController: GetCustomerController
  ) {}
  private getRoutes: IRoutes[] = [
    {
      path: '/getCustomer',
      controller: this.getCustomerController,
    },
  ]

  public get() {
    return this.getRoutes
  }
}
