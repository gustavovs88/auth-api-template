import 'reflect-metadata'
import { container } from '@di/container'
import { Config } from '@config/Config'
import { App } from '@presentation/App'

const config = container.resolve(Config)
const app: App = container.resolve(App)

app.createApp().listen(config.get().port)
