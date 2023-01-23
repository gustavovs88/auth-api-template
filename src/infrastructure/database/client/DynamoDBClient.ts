import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
// Set the AWS Region.
const REGION = 'sa-east-1' //e.g. "us-east-1"
// Create an Amazon DynamoDB service client object.
const dynamoDBClient = new DynamoDBClient({ region: REGION })

// Create service client module using ES6 syntax.
const marshallOptions = {
  // Whether to automatically convert empty strings, blobs, and sets to `null`.
  convertEmptyValues: false, // false, by default.
  // Whether to remove undefined values while marshalling.
  removeUndefinedValues: false, // false, by default.
  // Whether to convert typeof object to map attribute.
  convertClassInstanceToMap: false, // false, by default.
}

const unmarshallOptions = {
  // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
  wrapNumbers: false, // false, by default.
}

const translateConfig = { marshallOptions, unmarshallOptions }

// Create the DynamoDB Document client.
const ddbDocClient = DynamoDBDocumentClient.from(
  dynamoDBClient,
  translateConfig
)

export { ddbDocClient as dynamoDBDocClient, dynamoDBClient }
