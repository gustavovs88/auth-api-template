import { SendMessageCommand } from '@aws-sdk/client-sqs'
import { IConfig } from '@config/types/IConfig'
import { Types } from '@di/types'
import { Logger } from '@infrastructure/logger/Logger'
import { sqsClient } from '@infrastructure/messageBroker/client/SqsClient'
import { InternalServerError } from '@utils/exceptions/InternalServerError'
import { inject, injectable } from 'inversify'
import { TemplateFactory } from './TemplateFactory'
@injectable()
export class SqsProducer {
  private queues: Record<string, string>
  constructor(
    @inject(Types.Config) private config: IConfig,
    @inject(Types.Logger) private logger: Logger,
    @inject(Types.TemplateFactory) private templateFactory: TemplateFactory
  ) {
    const sqsUrl = this.config.get().sqsUrl
    this.queues = {
      transactionEmails: `${sqsUrl}/QueueTransactionEmails.fifo`,
    }
  }

  async sendSESEmail(emailParams: Record<any, any>) {
    const emailContent = await this.templateFactory.makeHtml(emailParams)
    const attributes = {
      html: { DataType: 'String', StringValue: emailContent },
      subject: { DataType: 'String', StringValue: emailParams.subject },
      fromEmail: { DataType: 'String', StringValue: emailParams.fromEmail },
      toEmail: { DataType: 'String', StringValue: emailParams.toEmail },
    }
    const params = {
      MessageAttributes: attributes,
      MessageBody: `Reset Password for customer ${emailParams.customerId}`,
      MessageDeduplicationId: emailParams.deduplicationId,
      MessageGroupId: emailParams.messageGroup,
      EventSource: 'aws:sqs',
      QueueUrl: this.queues.transactionEmails,
    }
    try {
      const data = await sqsClient.send(new SendMessageCommand(params))
      this.logger.info(`Success, message sent. MessageID: ${data.MessageId}`)
      return data
    } catch (error) {
      this.logger.error(
        `Error on sending transaction email. Subject: ${emailParams.subject}. Error: ${error}`
      )
      throw new InternalServerError('Falha ao enviar o e-mail.')
    }
  }
}
