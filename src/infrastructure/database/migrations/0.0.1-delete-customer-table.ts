import {
  CreateTableCommand,
  DeleteTableCommand,
  waitUntilTableNotExists,
  waitUntilTableExists,
  ListTablesCommand,
} from '@aws-sdk/client-dynamodb'
import { dynamoDBClient } from '@infrastructure/database/client/DynamoDBClient'
import { customerTableParams } from '@infrastructure/database/models/CustomerModel'
import { Logger } from '@infrastructure/logger/Logger'
import { InternalServerError } from '@utils/exceptions/InternalServerError'

const logger = new Logger()

export async function up() {
  try {
    await dynamoDBClient.send(new ListTablesCommand({}))
    await dynamoDBClient.send(
      new DeleteTableCommand({ TableName: 'customers' })
    )
    await waitUntilTableNotExists(
      {
        client: dynamoDBClient,
        maxWaitTime: 10,
        maxDelay: 2,
        minDelay: 1,
      },
      { TableName: 'customers' }
    )
    logger.info('Customer table deleted')
  } catch (err) {
    throw new InternalServerError(`Error on deleting customer table: ${err}`)
  }
}
export async function down() {
  try {
    await dynamoDBClient.send(new CreateTableCommand(customerTableParams))
    await waitUntilTableExists(
      {
        client: dynamoDBClient,
        maxWaitTime: 10,
        maxDelay: 2,
        minDelay: 1,
      },
      { TableName: 'customers' }
    )
    logger.info('Customer table created')
  } catch (err) {
    throw new InternalServerError(`Error on creating customer table: ${err}`)
  }
}
