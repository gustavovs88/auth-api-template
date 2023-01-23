export let Types = {
  // Application
  Config: Symbol.for('Config'),
  Server: Symbol.for('Server'),
  Routes: Symbol.for('Routes'),
  App: Symbol.for('App'),
  MigrationsClient: Symbol.for('MigrationsClient'),
  Logger: Symbol.for('Logger'),
  MessageBrokerManager: Symbol.for('MessageBrokerManager'),
  TemplateFactory: Symbol.for('TemplateFactory'),
  // Customer
  CustomerRoutes: Symbol.for('CustomerRoutes'),
  GetCustomerByIdController: Symbol.for('GetCustomerByIdController'),
  CreateCustomerController: Symbol.for('CreateCustomerController'),
  PutCustomerPasswordController: Symbol.for('PutCustomerPasswordController'),
  CustomerService: Symbol.for('GetCustomerService'),
  CustomerRepository: Symbol.for('GetCustomerRepository'),
  // Authentication
  AuthRoutes: Symbol.for('AuthRoutes'),
  LoginController: Symbol.for('LoginController'),
  RefreshController: Symbol.for('RefreshController'),
  ResetPasswordController: Symbol.for('ResetPasswordController'),
  AuthService: Symbol.for('AuthService'),
  SendEmailProducer: Symbol.for('SendEmailProducer'),
  SendEmailConsumer: Symbol.for('SendEmailConsumer'),
  ValidateResetPasswordLinkController: Symbol.for(
    'ValidateResetPasswordLinkController'
  ),
}
