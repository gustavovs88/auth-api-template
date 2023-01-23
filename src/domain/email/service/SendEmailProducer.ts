import { Types } from '@di/types'
import { Logger } from '@infrastructure/logger/Logger'
import { BaseProducer } from '@infrastructure/messageBroker/BaseProducer'
import { EKafkaTopics } from '@infrastructure/messageBroker/client/KafkaClient'
import { inject, injectable } from 'inversify'

@injectable()
export class SendEmailProducer extends BaseProducer {
  constructor(@inject(Types.Logger) logger: Logger) {
    super(logger)
    this.topic = EKafkaTopics.EmailNotification
  }
}
