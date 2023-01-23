import { inject, injectable } from 'inversify'
import { IRoutes } from '@presentation/types/IRoutes'
import { Types } from '@di/types'
import { ICustomerRoutes } from '@domain/customer/presentation/types/ICustomerRoutes'
import { CreateCustomerController } from '@domain/customer/presentation/controllers/CreateCustomerController'
import { GetCustomerByIdController } from '@domain/customer/presentation/controllers/GetCustomerByIdController'
import { PutCustomerPasswordController } from './controllers/PutCustomerPasswordController'

@injectable()
export class CustomerRoutes implements ICustomerRoutes {
  constructor(
    @inject(Types.GetCustomerByIdController)
    private getCustomerByIdController: GetCustomerByIdController,
    @inject(Types.CreateCustomerController)
    private createCustomerController: CreateCustomerController,
    @inject(Types.PutCustomerPasswordController)
    private putCustomerPasswordController: PutCustomerPasswordController
  ) {}
  private getRoutes: IRoutes[] = [
    {
      path: '/api/v1/customer/:customerId',
      controller: this.getCustomerByIdController,
    },
  ]

  private postRoutes: IRoutes[] = [
    {
      path: '/api/v1/customer/create',
      controller: this.createCustomerController,
    },
  ]

  private putRoutes: IRoutes[] = [
    {
      path: '/api/v1/customer/password',
      controller: this.putCustomerPasswordController,
    },
  ]

  public get() {
    return this.getRoutes
  }

  public post() {
    return this.postRoutes
  }

  public put() {
    return this.putRoutes
  }
}
