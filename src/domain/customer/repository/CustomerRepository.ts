import { inject, injectable } from 'inversify'
import {
  ICustomer,
  ICustomerDbResponse,
  ICustomerResponse,
} from '../types/ICustomer'
import { dynamoDBDocClient } from '@infrastructure/database/client/DynamoDBClient'
import { v4 as uuidv4 } from 'uuid'
import { InternalServerError } from '@utils/exceptions/InternalServerError'
import { Types } from '@di/types'
import { Logger } from '@infrastructure/logger/Logger'
import {
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb'
import { ICustomerRepository } from './ICustomerRepository'

@injectable()
export class CustomerRepository implements ICustomerRepository {
  private tableName: string
  constructor(@inject(Types.Logger) private logger: Logger) {
    this.tableName = 'customers'
  }
  async insert(params: ICustomer) {
    const query = {
      TableName: this.tableName,
      Item: { ...params, id: uuidv4() },
      ReturnValues: 'ALL_OLD',
    }

    try {
      await dynamoDBDocClient.send(new PutCommand(query))
      return query.Item
    } catch (error) {
      this.logger.error(`Failed to create customer: ${error}`)
      throw new InternalServerError('Failed to create customer')
    }
  }

  async getById(customerId: string): Promise<ICustomerResponse | undefined> {
    const query = {
      TableName: this.tableName,
      Key: { id: customerId },
    }

    try {
      const data: ICustomerDbResponse = (await dynamoDBDocClient.send(
        new GetCommand(query)
      )) as ICustomerDbResponse
      return data.Item
    } catch (error) {
      this.logger.error(`Failed to retrieve customer: ${error}`)
      throw new InternalServerError('Failed to retrieve customer')
    }
  }

  async getByEmail(
    customerEmail: string
  ): Promise<ICustomerResponse | undefined> {
    const query = {
      TableName: this.tableName,
      IndexName: 'email',
      KeyConditionExpression: 'email = :e',
      ExpressionAttributeValues: {
        ':e': customerEmail,
      },
    }

    try {
      const data = (await dynamoDBDocClient.send(
        new QueryCommand(query)
      )) as ICustomerDbResponse
      return data.Items ? data.Items[0] : undefined
    } catch (error) {
      this.logger.error(`Failed to retrieve customer: ${error}`)
      throw new InternalServerError('Failed to retrieve customer')
    }
  }

  async updatePassword(
    customerId: string,
    newPassword: string
  ): Promise<ICustomerResponse | undefined> {
    const query = {
      TableName: this.tableName,
      Key: {
        id: customerId,
      },
      UpdateExpression: 'set password = :x',
      ExpressionAttributeValues: {
        ':x': newPassword,
      },
    }

    try {
      const data: ICustomerDbResponse = (await dynamoDBDocClient.send(
        new UpdateCommand(query)
      )) as ICustomerDbResponse
      return data.Item
    } catch (error) {
      this.logger.error(
        `Failed to update customer ${customerId} password: ${error}`
      )
      throw new InternalServerError('Failed to update customer password')
    }
  }
}
