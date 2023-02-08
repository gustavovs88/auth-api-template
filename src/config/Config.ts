import dotenv from 'dotenv'
import { injectable } from 'inversify'
import { IConfig } from '@config/types/IConfig'

export enum EnvironmentType {
  Develop = 'development',
  Staging = 'staging',
  Production = 'production',
}

/**
 * A simple application configuration interface.
 */
export interface Configuration {
  // Server Configuration
  port: number
  requestSizeLimit: string
  gracefulTerminationTimeout: number

  // Service Configuration
  serviceName: string
  environment: EnvironmentType
  shortEnvironment: string
  awsRegion: string
  tokenSecret: string
  refreshTokenSecret: string
  adminEmail: string
  webDomain: string
  // Message Broker

  kafkaServer: string

  // Database
  logging: {
    enabled: boolean
    queueURL: string
  }
}

/**
 * An injectable Config class, with a single `get` method that returns
 * all configs.
 */
@injectable()
export class Config implements IConfig {
  private readonly config: Configuration

  constructor() {
    this.config = this.getConfigFromEnv()
  }

  public get() {
    return this.config
  }

  private getConfigFromEnv(): Configuration {
    dotenv.config()

    return {
      awsRegion: process.env.AWS_REGION || 'sa-east-1',
      requestSizeLimit: '100kb',
      gracefulTerminationTimeout: 10 * 1000,

      serviceName: process.env.SERVICE_NAME || 'no-name',
      adminEmail: process.env.ADMIN_EMAIL || '',
      webDomain: process.env.WEB_DOMAIN || 'http://localhost:5173',
      environment: (process.env.NODE_ENV as EnvironmentType) || 'development',
      shortEnvironment:
        process.env.NODE_ENV == EnvironmentType.Production ? 'prd' : 'stg',

      tokenSecret: process.env.TOKEN_SECRET || '',
      refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || '',

      logging: {
        enabled: process.env.LOGGING_ENABLED === 'true',
        queueURL: process.env.LOGGING_QUEUE_URL || '',
      },

      kafkaServer: process.env.KAFKA_SERVER || 'localhost:9092',

      port: Number(process.env.PORT) || 80,
    }
  }
}
