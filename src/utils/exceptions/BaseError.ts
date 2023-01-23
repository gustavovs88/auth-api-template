interface BaseErrorOptions {
  message: string
  name?: string
  statusCode?: number
}

interface ErrorMessage {
  error: {
    code: number
    message: {
      value: string
      formatted: string
    }
  }
}

export class BaseError extends Error {
  public readonly customError: boolean = true
  public readonly name: string
  public readonly statusCode: number

  constructor({ message, name, statusCode }: BaseErrorOptions) {
    super(message)
    this.name = name || 'BaseError'
    this.statusCode = statusCode || 500
  }

  public getErrorMessage(): ErrorMessage {
    return {
      error: {
        code: this.statusCode,
        message: {
          value: this.name,
          formatted: this.message,
        },
      },
    }
  }
}
