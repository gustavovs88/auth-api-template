import { Configuration } from '@config/Config'

export type IServerConfig = Pick<
  Configuration,
  'port' | 'requestSizeLimit' | 'gracefulTerminationTimeout' | 'logging'
>
