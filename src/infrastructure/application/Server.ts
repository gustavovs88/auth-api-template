import * as http from 'http'
import { once } from 'events'
import express from 'express'
import 'express-async-errors'
import { createHttpTerminator, HttpTerminator } from 'http-terminator'
import httpPino, { HttpLogger } from 'pino-http'
import pino, { Logger } from 'pino'
import { IServerConfig } from '@config/types/IServerConfig'

export class Server {
  public readonly router = express.Router()
  public readonly app = express()

  private logger: Logger = pino()
  private httpLogger: HttpLogger = httpPino()
  private server?: http.Server
  private httpTerminator?: HttpTerminator

  constructor(public config?: IServerConfig) {
    this.app.disable('x-powered-by')
    this.app.get('/v1/status', (_, res) => res.sendStatus(200))
    this.app.use(this.router)
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
    const server = this.app.listen(port)
    await once(server, 'listening')
    this.server = server
    this.httpTerminator = createHttpTerminator({
      server,
      gracefulTerminationTimeout: this.config?.gracefulTerminationTimeout,
    })

    // https://github.com/nodejs/node/issues/27363
    this.server.keepAliveTimeout = 65000
    this.server.headersTimeout = 66000

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
