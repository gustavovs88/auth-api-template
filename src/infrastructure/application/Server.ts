import * as bodyParser from 'body-parser'
import { once } from 'events'
import express from 'express'
import 'express-async-errors'
import { createHttpTerminator, HttpTerminator } from 'http-terminator'
import httpPino, { HttpLogger } from 'pino-http'
import pino, { Logger } from 'pino'
import { IServerConfig } from '@config/types/IServerConfig'
import { InversifyExpressServer } from 'inversify-express-utils'
import { container } from '@di/container'
import { inject, injectable } from 'inversify'
import { Types } from '@di/types'
@injectable()
export class Server {
  public readonly router = express.Router()
  private server: InversifyExpressServer
  private logger: Logger = pino()
  private httpLogger: HttpLogger = httpPino()
  private httpTerminator?: HttpTerminator

  constructor(@inject(Types.Config) private config: IServerConfig) {
    this.server = new InversifyExpressServer(container)
    this.server.setConfig((app) => {
      // add body parser
      app.use(
        bodyParser.urlencoded({
          extended: true,
        })
      )
      app.use(bodyParser.json())
      app.disable('x-powered-by')
      app.get('/v1/status', (_, res) => res.sendStatus(200))
      app.use(this.router)
    })
    this.router.use(
      express.json({ limit: this.config?.requestSizeLimit || '100kb' })
    )

    if (this.config?.logging?.enabled) this.router.use(this.httpLogger)

    // TO DO add remote logger
  }

  /** When no port is passed, node listens on random free port.
   * Returned Promise resolves to the assigned port.
   */
  public async listen(port = this.config?.port): Promise<number> {
    this.logger.info('Starting server')
    let app = this.server.build()
    const server = app.listen(port)
    await once(server, 'listening')
    this.httpTerminator = createHttpTerminator({
      server,
      gracefulTerminationTimeout: this.config?.gracefulTerminationTimeout,
    })

    // https://github.com/nodejs/node/issues/27363
    server.keepAliveTimeout = 65000
    server.headersTimeout = 66000

    const address = server.address()
    const assignedPort =
      address && typeof address !== 'string' ? address.port : port
    this.logger.info(`Server listening on http://localhost:${assignedPort}`)
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
      this.logger.warn('No server to dispose')
    }
  }
}
