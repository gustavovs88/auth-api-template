import path from 'path'
import juice from 'juice'
import * as Sqrl from 'squirrelly'
import { injectable } from 'inversify'
import { InternalServerError } from '@utils/exceptions/InternalServerError'

@injectable()
export class TemplateFactory {
  async makeHtml(properties: Record<string, any>) {
    try {
      const { templateDomain, templateName } = properties
      const templateFilePath = path.join(
        __dirname,
        `../${templateDomain}/templates/${templateName}-template.squirrelly`
      )
      const squirrellyHtml = await Sqrl.renderFile(templateFilePath, properties)
      const email = await this.getJuicedHtml(squirrellyHtml)
      return email
    } catch (error: any) {
      throw new InternalServerError(
        `Unable to generate email html Error: ${error}`
      )
    }
  }

  async getJuicedHtml(squirrellyHtml: string): Promise<string> {
    return new Promise((resolve, reject) => {
      juice.juiceResources(
        squirrellyHtml,
        {
          preserveMediaQueries: true,
        },
        (error, html) => {
          if (error) {
            reject(null)
            throw new InternalServerError(
              `Unable to generate email html Error: ${error}`
            )
          }
          resolve(html)
        }
      )
    })
  }
}
