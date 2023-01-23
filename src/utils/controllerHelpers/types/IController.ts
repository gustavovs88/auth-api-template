export type HttpResponse = {
  [key: string]: any
  statusCode?: number
  error?: HttpResponseError
}

export type HttpResponseError = {
  code: number
  message: {
    value: string
    formatted: string
  }
  key?: string
}

export type HttpRequest = {
  referer?: any
  route?: any
  url?: string
  method?: any
  userAgent?: any
  remoteAddress?: any
  cookies?: any
  body?: any
  headers?: any
  params?: any
  customer?: {
    id: string
  }
  query?: any
  request?: any
  locals?: any
  files?: any
}
