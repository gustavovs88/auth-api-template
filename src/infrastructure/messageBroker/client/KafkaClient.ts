import { Config } from '@config/Config'
import { Kafka } from 'kafkajs'

// This creates a client instance that is configured to connect to the Kafka broker provided by
// the environment variable KAFKA_BOOTSTRAP_SERVER
const config = new Config().get()
export const kafkaClient = new Kafka({
  clientId: 'resetei-email-service',
  brokers: [config.kafkaServer],
  retry: {
    initialRetryTime: 100,
    retries: 8,
  },
})

export enum EKafkaTopics {
  Base = 'Base',
  EmailNotification = 'Queuing.Email.ResetPassword',
}

export interface CustomMessageFormat {
  [key: string]: any
}
