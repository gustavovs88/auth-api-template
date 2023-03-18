/**
 * @type {import('@shelf/jest-dynamodb/lib').Config}')}
 */
const {
  customerTableParams,
} = require('./src/infrastructure/database/models/CustomerModel')

const config = {
  tables: [customerTableParams],
  port: 8000,
  installerConfig: {
    installPath: './dynamodblocal',
  },
}
module.exports = config
