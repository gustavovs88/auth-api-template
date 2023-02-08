import { Container } from 'inversify'
import { Types } from '@di/types'
import { App } from '@presentation/App'
import { Config } from '@config/Config'
import { GetCustomerByIdController } from '@domain/customer/presentation/controllers/GetCustomerByIdController'
import { Server } from '@infrastructure/application/Server'
import { CustomerRoutes } from '@domain/customer/presentation/CustomerRoutes'
import { Routes } from '@presentation/Routes'
import { CustomerService } from '@domain/customer/service/CustomerService'
import { CustomerRepository } from '@domain/customer/repository/CustomerRepository'
import { Logger } from '@infrastructure/logger/Logger'
import { MigrationsClient } from '@infrastructure/database/migrations/client/MigrationsClient'
import { CreateCustomerController } from '@domain/customer/presentation/controllers/CreateCustomerController'
import { ICustomerRoutes } from '@domain/customer/presentation/types/ICustomerRoutes'
import { IConfig } from '@config/types/IConfig'
import { AuthRoutes } from '@domain/authentication/presentation/AuthRoutes'
import { LoginController } from '@domain/authentication/presentation/controllers/LoginController'
import { AuthService } from '@domain/authentication/service/AuthService'
import { RefreshController } from '@domain/authentication/presentation/controllers/RefreshController'
import { ResetPasswordController } from '@domain/authentication/presentation/controllers/ResetPasswordController'
import { MessageBrokerManager } from '@infrastructure/messageBroker/MessageBrokerManager'
import { TemplateFactory } from '@domain/email/service/TemplateFactory'
import { SendEmailProducer } from '@domain/email/service/SendEmailProducer'
import { SendEmailConsumer } from '@domain/email/service/SendEmailConsumer'
import { ValidateResetPasswordLinkController } from '@domain/authentication/presentation/controllers/ValidateResetPasswordLink'
import { PutCustomerPasswordController } from '@domain/customer/presentation/controllers/PutCustomerPasswordController'
import { LogoutController } from '@domain/authentication/presentation/controllers/LogoutController'
import {
  ICustomerRepository,
  ICustomerService,
} from '@domain/customer/types/ICustomer'

let container = new Container({ defaultScope: 'Singleton' })

// Application
container.bind<IConfig>(Types.Config).to(Config)
container.bind(Types.Server).to(Server)
container.bind(Types.Routes).to(Routes)
container.bind(Types.App).to(App)
container.bind(Types.MigrationsClient).to(MigrationsClient)
container.bind(Types.Logger).to(Logger)
container.bind(Types.MessageBrokerManager).to(MessageBrokerManager)
container.bind(Types.TemplateFactory).to(TemplateFactory)
// Customer
container.bind(Types.GetCustomerByIdController).to(GetCustomerByIdController)
container.bind(Types.CreateCustomerController).to(CreateCustomerController)
container
  .bind(Types.PutCustomerPasswordController)
  .to(PutCustomerPasswordController)
container.bind<ICustomerService>(Types.CustomerService).to(CustomerService)
container
  .bind<ICustomerRepository>(Types.CustomerRepository)
  .to(CustomerRepository)
container.bind<ICustomerRoutes>(Types.CustomerRoutes).to(CustomerRoutes)
// Authentication
container.bind(Types.AuthRoutes).to(AuthRoutes)
container.bind(Types.LoginController).to(LoginController)
container.bind(Types.LogoutController).to(LogoutController)
container.bind(Types.RefreshController).to(RefreshController)
container.bind(Types.AuthService).to(AuthService)
container.bind(Types.ResetPasswordController).to(ResetPasswordController)
container
  .bind(Types.ValidateResetPasswordLinkController)
  .to(ValidateResetPasswordLinkController)

// Email
container.bind(Types.SendEmailProducer).to(SendEmailProducer)
container.bind(Types.SendEmailConsumer).to(SendEmailConsumer)

export { container }
