import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

const isTest = process.env.JEST_WORKER_ID
// Set the AWS Region.
const REGION = isTest ? 'local-env' : 'us-east-1' //e.g. "us-east-1"
// Create an Amazon DynamoDB service client object.
const dynamoDBClient = new DynamoDBClient({
  region: REGION,
  ...(isTest && {
    endpoint: 'http://localhost:8000',
    sslEnabled: false,
    credentials: {
      accessKeyId: 'fakeMyKeyId',
      secretAccessKey: 'fakeSecretAccessKey',
    },
  }),
})

// Create service client module using ES6 syntax.
const marshallOptions = {
  // Whether to automatically convert empty strings, blobs, and sets to `null`.
  convertEmptyValues: true, // false, by default.
}

const translateConfig = { marshallOptions }

// Create the DynamoDB Document client.
const ddbDocClient = DynamoDBDocumentClient.from(
  dynamoDBClient,
  translateConfig
)

export { ddbDocClient as dynamoDBDocClient, dynamoDBClient }
