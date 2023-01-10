import { Types } from '@di/types'
import { Server } from '@infrastructure/application/Server'
import { inject, injectable } from 'inversify'
import { Routes } from './Routes'
@injectable()
export class App {
  constructor(
    @inject(Types.Server) private server: Server,
    @inject(Types.Routes) private routes: Routes
  ) {}
  createApp() {
    this.routes.initRouter()
    return this.server
  }
}
