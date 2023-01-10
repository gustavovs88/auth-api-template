import { Configuration } from '@config/Config'

export interface IConfig {
  get(): Configuration
}
