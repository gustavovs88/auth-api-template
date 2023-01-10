import { inject, injectable } from 'inversify'
import { IRoutes } from '@presentation/types/IRoutes'
import { Types } from '@di/types'
import { IGetCustomerController } from './controllers/types/IGetCustomerController'
import { ICustomerRoutes } from './types/ICustomerRoutes'
import { GetCustomerController } from './controllers/GetCustomerController'

@injectable()
export class CustomerRoutes implements ICustomerRoutes {
  private _getCustomerController: IGetCustomerController
  constructor(
    @inject(Types.GetCustomerController)
    getCustomerController: GetCustomerController
  ) {
    this._getCustomerController = getCustomerController
  }
  private getRoutes: IRoutes[] = [
    {
      path: '/getCustomer',
      controller: this._getCustomerController,
    },
  ]

  public get() {
    return this.getRoutes
  }
}
