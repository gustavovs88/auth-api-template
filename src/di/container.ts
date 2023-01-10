let inversify = require('inversify')
import { Types } from '@di/types'
import { App } from '@presentation/App'
import { Config } from '@config/Config'
import { GetCustomerController } from '@domain/customer/presentation/controllers/GetCustomerController'
import { Server } from '@infrastructure/application/Server'
import { CustomerRoutes } from '@domain/customer/presentation/CustomerRoutes'
import { Routes } from '@presentation/Routes'

// declare your container
let container = new inversify.Container({ defaultScope: 'Singleton' })

container.bind(Types.Config).to(Config)
container.bind(Types.GetCustomerController).to(GetCustomerController)
container.bind(Types.CustomerRoutes).to(CustomerRoutes)
container.bind(Types.Server).to(Server)
container.bind(Types.Routes).to(Routes)
container.bind(Types.App).to(App)

export { container }
