import { Config } from '@config/Config'
import { Server } from '@infrastructure/application/Server'
import { Routes } from './Routes'

export class App {
  static createApp() {
    const config = new Config().get()
    const server = new Server(config)
    const router = server.router
    const routes = new Routes(router)
    routes.initRouter()

    return server
  }
}
