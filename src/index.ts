import 'reflect-metadata'
import { Config } from '@config/Config'
import { App } from '@presentation/App'

const config = new Config()
const app = App.createApp()
app.listen(config.get().port)
