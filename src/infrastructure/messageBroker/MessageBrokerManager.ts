import { Types } from '@di/types'
import { SendEmailConsumer } from '@domain/email/service/SendEmailConsumer'
import { SendEmailProducer } from '@domain/email/service/SendEmailProducer'
import { inject, injectable } from 'inversify'
import { BaseProducer } from './BaseProducer'

@injectable()
export class MessageBrokerManager {
  private producers: BaseProducer[]
  constructor(
    @inject(Types.SendEmailConsumer)
    private sendEmailConsumer: SendEmailConsumer,
    @inject(Types.SendEmailProducer)
    private sendEmailProducer: SendEmailProducer
  ) {
    this.producers = [this.sendEmailProducer]
  }

  public async startAll() {
    this.producers.forEach(async (producer) => {
      await producer.start()
    })
    await Promise.all([this.sendEmailConsumer.run()])
  }

  public async shutDownAll() {
    await Promise.all([
      this.sendEmailConsumer.shutdown(),
      this.sendEmailProducer.shutdown(),
    ])
  }
}
