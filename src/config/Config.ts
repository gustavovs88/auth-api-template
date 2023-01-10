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
  instance?: string

  observability: {
    enabled: boolean
    enableDebug?: boolean
    ignoreIncomingPaths?: string[]
  }

  logging: {
    enabled: boolean
    queueURL: string
  }

  docs: {
    enabled: boolean
  }

  // Databases configuration
  redis: {
    enabled: boolean
    port: number
    host: string
    db: number
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
      requestSizeLimit: '100kb',
      gracefulTerminationTimeout: 10 * 1000,

      serviceName: process.env.SERVICE_NAME || 'no-name',
      environment: (process.env.NODE_ENV as EnvironmentType) || 'development',
      shortEnvironment:
        process.env.NODE_ENV == EnvironmentType.Production ? 'prd' : 'stg',

      logging: {
        enabled: process.env.LOGGING_ENABLED === 'false',
        queueURL: process.env.LOGGING_QUEUE_URL || '',
      },

      docs: {
        enabled: process.env.DOCS_ENABLED === 'true',
      },

      observability: {
        enabled: process.env.OBSERVABILITY_TRACE_ENABLED === 'true',
      },

      redis: {
        enabled: process.env.REDIS_ENABLED === 'true',
        host: process.env.REDIS_HOST || '',
        port: Number(process.env.REDIS_PORT) || 6379,
        db: Number(process.env.REDIS_DB) || 9,
      },

      port: Number(process.env.PORT) || 8000,
    }
  }
}
