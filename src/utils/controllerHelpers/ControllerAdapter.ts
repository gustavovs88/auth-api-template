import {
  HttpRequest,
  HttpResponse,
} from '@utils/controllerHelpers/types/IController'
import { Request, Response } from 'express'
import { IController } from '@utils/controllerHelpers/BaseController'
import pinoHttp from 'pino-http'
import { Container } from 'inversify'
import { Config } from '@config/Config'

// Usage: get('/some-route', controllerAdapter(new SomeController()))
export function controllerAdapter(controller: IController) {
  return async (req: Request & { files?: any }, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body,
      cookies: req.cookies,
      params: req.params,
      query: req.query,
      headers: req.headers,
      locals: res.locals,
      files: req.files,
    }

    let httpResponse: HttpResponse = res

    const container = new Container()
    const config = container.resolve(Config).get()
    if (config.logging.enabled) {
      const logger = pinoHttp()
      logger(req, res)
    }
    const response = await controller.handle(httpRequest, httpResponse)

    if (response.error) {
      return res.status(response.error.code).send(response)
    }

    if (response.statusCode) {
      return res.status(response.statusCode).send(response.data)
    }

    return res.status(200).send(response.data)
  }
}
