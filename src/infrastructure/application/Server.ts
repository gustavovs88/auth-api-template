import * as bodyParser from 'body-parser'
import { once } from 'events'
import express from 'express'
import 'express-async-errors'
import { createHttpTerminator, HttpTerminator } from 'http-terminator'
import { IServerConfig } from '@config/types/IServerConfig'
import { InversifyExpressServer } from 'inversify-express-utils'
import cookieParser from 'cookie-parser'
import { container } from '@di/container'
import { inject, injectable } from 'inversify'
import { Types } from '@di/types'
import { errorHandler } from '@utils/exceptions/ErrorHandler'
import { Logger } from '@infrastructure/logger/Logger'
import { MessageBrokerManager } from '@infrastructure/messageBroker/MessageBrokerManager'
import cors from 'cors'
import { IConfig } from '@config/types/IConfig'
@injectable()
export class Server {
  public readonly router = express.Router()
  private server: InversifyExpressServer
  private serverConfig: IServerConfig
  private httpTerminator?: HttpTerminator

  constructor(
    @inject(Types.Config) config: IConfig,
    @inject(Types.Logger) private logger: Logger,
    @inject(Types.MessageBrokerManager)
    private messageBrokerManager: MessageBrokerManager
  ) {
    this.serverConfig = config.get()
    this.server = new InversifyExpressServer(container)
    this.server.setConfig((app) => {
      // adding app configs
      app.use(
        bodyParser.urlencoded({
          extended: true,
        })
      )
      app.use(bodyParser.json())
      app.use(cookieParser())
      app.disable('x-powered-by')
      app.use(
        cors({
          origin: ['http://localhost:5173', this.serverConfig.webDomain],
          methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
          credentials: true,
          preflightContinue: false,
          optionsSuccessStatus: 204,
        })
      )
      app.get('/v1/status', (_, res) => res.sendStatus(200))
      app.use(this.router)
      app.use(errorHandler)
    })
    this.router.use(
      express.json({ limit: this.serverConfig?.requestSizeLimit || '100kb' })
    )
    // TO DO add remote logger
  }

  /** When no port is passed, node listens on random free port.
   * Returned Promise resolves to the assigned port.
   */
  public async listen(port = this.serverConfig?.port): Promise<number> {
    this.logger.info('Starting server')
    let app = this.server.build()
    const server = app.listen(port)
    await once(server, 'listening')
    this.httpTerminator = createHttpTerminator({
      server,
      gracefulTerminationTimeout: this.serverConfig?.gracefulTerminationTimeout,
    })

    // https://github.com/nodejs/node/issues/27363
    server.keepAliveTimeout = 65000
    server.headersTimeout = 66000

    const address = server.address()
    const assignedPort =
      address && typeof address !== 'string' ? address.port : port
    this.logger.info(`Server listening on http://localhost:${assignedPort}`)

    const errorTypes = ['unhandledRejection', 'uncaughtException']
    const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

    errorTypes.forEach((type) => {
      process.on(type, async () => {
        try {
          this.logger.info(`process.on ${type}`)
          await this.dispose()
          await this.messageBrokerManager.shutDownAll()
          process.exit(0)
        } catch (_) {
          process.exit(1)
        }
      })
    })

    signalTraps.forEach((type) => {
      process.once(type, async () => {
        try {
          await this.dispose()
          await this.messageBrokerManager.shutDownAll()
        } finally {
          process.kill(process.pid, type)
        }
      })
    })
    return Number(assignedPort)
  }

  public async dispose(): Promise<void> {
    this.logger.info('Disposing server')
    if (this.server) {
      const start = new Date().getTime()
      await this.httpTerminator?.terminate()
      const end = new Date().getTime()
      this.logger.info(`Server disposed in ${end - start}ms`)
    } else {
      this.logger.info('No server to dispose')
    }
  }
}
