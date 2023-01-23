import { Types } from '@di/types'
import { Logger } from '@infrastructure/logger/Logger'
import {
  EKafkaTopics,
  kafkaClient,
} from '@infrastructure/messageBroker/client/KafkaClient'
import { inject, injectable } from 'inversify'
import { Consumer, ConsumerRunConfig, ConsumerSubscribeTopics } from 'kafkajs'

@injectable()
export abstract class BaseConsumer {
  private kafkaClient = kafkaClient
  private kafkaConsumer: Consumer
  protected topics: EKafkaTopics[]
  constructor(@inject(Types.Logger) private log: Logger) {
    this.topics = [EKafkaTopics.Base]
    this.kafkaConsumer = this.createKafkaConsumer()
  }

  protected async run(messageHandler: ConsumerRunConfig) {
    const topic: ConsumerSubscribeTopics = {
      topics: this.topics,
      fromBeginning: false,
    }
    try {
      await this.kafkaConsumer.connect()
      await this.kafkaConsumer.subscribe(topic)
      await this.kafkaConsumer.run(messageHandler)
      this.log.info(`Consumer subscribed to: ${this.topics}`)
    } catch (error) {
      this.log.error(`Error: ${error}`)
    }
  }

  public async shutdown(): Promise<void> {
    await this.kafkaConsumer.disconnect()
  }

  private createKafkaConsumer(): Consumer {
    const consumer = this.kafkaClient.consumer({ groupId: 'consumer-group' })
    return consumer
  }
}
