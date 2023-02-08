export interface ILogger {
  info(_obj: any, message: string): void
  error(message: string): void
}
