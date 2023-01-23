import { SendEmailCommand } from '@aws-sdk/client-ses'
import { Types } from '@di/types'
import {
  ETemplateDomain,
  ETemplateName,
} from '@domain/email/service/ITemplateFactory'
import { TemplateFactory } from '@domain/email/service/TemplateFactory'
import { EmailClient } from '@infrastructure/email/EmailServiceClient'
import { Logger } from '@infrastructure/logger/Logger'
import { BaseConsumer } from '@infrastructure/messageBroker/BaseConsumer'
import { EKafkaTopics } from '@infrastructure/messageBroker/client/KafkaClient'
import { inject, injectable } from 'inversify'
import { EachMessagePayload } from 'kafkajs'

@injectable()
export class SendEmailConsumer extends BaseConsumer {
  constructor(
    @inject(Types.Logger) private logger: Logger,
    @inject(Types.TemplateFactory) private templateFactory: TemplateFactory
  ) {
    super(logger)
    this.topics = [EKafkaTopics.EmailNotification]
  }

  async run() {
    await super.run({
      eachMessage: this.consumeMessage.bind(this),
    })
  }

  async consumeMessage(messagePayload: EachMessagePayload) {
    const { topic, partition, message } = messagePayload
    const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
    this.logger.info(
      `Incoming message ${prefix} ${message.key}::${message.value}`
    )
    if (message?.value) {
      const messageContent = message.value.toString()
      const properties = JSON.parse(messageContent)
      await this.sendEmail(properties)
    }
  }

  private createSendEmailCommand = (
    toAddress: string,
    fromAddress: string,
    subject: string,
    emailHtmlContent: string
  ) => {
    return new SendEmailCommand({
      Destination: {
        ToAddresses: [toAddress],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: emailHtmlContent,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
      Source: fromAddress,
    })
  }

  private async sendEmail(properties: {
    name: string
    email: string
    fromEmail: string
    subject: string
    templateName: ETemplateName
    templateDomain: ETemplateDomain
  }) {
    try {
      const emailContent = await this.templateFactory.makeHtml(properties)
      return await EmailClient.send(
        this.createSendEmailCommand(
          properties.email,
          properties.fromEmail,
          properties.subject,
          emailContent
        )
      )
    } catch (error) {
      this.logger.error(
        `Failed to send ${properties.templateName} email. Error :: ${error}`
      )
      return error
    }
  }
}
