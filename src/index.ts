import 'reflect-metadata'
import { container } from '@di/container'
import { Config } from '@config/Config'
import { App } from '@presentation/App'

const config = container.resolve(Config)
const app: App = container.resolve(App)
const server = async () => {
  const server = await app.createApp()
  server.listen(config.get().port)
}
server()
