let inversify = require('inversify')
import { Types } from '@di/types'
import { Config } from '@config/Config'
import { GetCustomerController } from '@domain/customer/presentation/controllers/GetCustomerController'

// declare your container
let container = new inversify.Container({ defaultScope: 'Singleton' })

container.bind(Types.Config).to(Config)
container.bind(Types.GetCustomerController).to(GetCustomerController)

export { container }
