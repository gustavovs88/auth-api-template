import { Message, Producer, ProducerRecord } from 'kafkajs'
import {
  CustomMessageFormat,
  EKafkaTopics,
  kafkaClient,
} from '@infrastructure/messageBroker/client/KafkaClient'
import { inject, injectable } from 'inversify'
import { Types } from '@di/types'
import { Logger } from '@infrastructure/logger/Logger'

@injectable()
export class BaseProducer {
  private producer: Producer
  private kafkaClient = kafkaClient
  protected topic: EKafkaTopics

  constructor(@inject(Types.Logger) private log: Logger) {
    this.producer = this.createProducer()
    this.topic = EKafkaTopics.Base
  }

  public async start(): Promise<void> {
    try {
      await this.producer.connect()
    } catch (error) {
      this.log.error(`Error connecting the producer: ${error}`)
    }
  }

  public async shutdown(): Promise<void> {
    const { DISCONNECT } = this.producer.events
    await this.producer.disconnect()
    this.producer.on(DISCONNECT, () => this.log.info('Consumer disconected'))
  }

  public async send(message: CustomMessageFormat): Promise<void> {
    const kafkaMessage: Message = { value: JSON.stringify(message) }

    const record: ProducerRecord = {
      topic: this.topic,
      messages: [kafkaMessage],
    }
    try {
      await this.producer.send(record)
      this.log.info(`Sending message: ${record}`)
    } catch (error) {
      this.log.error(`Error sending message: ${error}`)
    }
  }

  private createProducer(): Producer {
    return this.kafkaClient.producer()
  }
}
