import { Types } from '@di/types'
import { Server } from '@infrastructure/application/Server'
import { MigrationsClient } from '@infrastructure/database/migrations/client/MigrationsClient'
import { MessageBrokerManager } from '@infrastructure/messageBroker/MessageBrokerManager'
import { inject, injectable } from 'inversify'
import { Routes } from './Routes'
@injectable()
export class App {
  constructor(
    @inject(Types.MigrationsClient) private migrationsClient: MigrationsClient,
    @inject(Types.Server) private server: Server,
    @inject(Types.Routes) private routes: Routes,
    @inject(Types.MessageBrokerManager)
    private messageBrokerManager: MessageBrokerManager
  ) {}
  async createApp() {
    this.migrationsClient.up()
    this.routes.initRouter()
    this.messageBrokerManager.startAll()
    return this.server
  }
}
