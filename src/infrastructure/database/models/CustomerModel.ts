// Set the parameters
export const tableParams = {
  AttributeDefinitions: [
    {
      AttributeName: 'id', //ATTRIBUTE_NAME_1
      AttributeType: 'S', //ATTRIBUTE_TYPE
    },
    {
      AttributeName: 'email', //ATTRIBUTE_NAME_1
      AttributeType: 'S', //ATTRIBUTE_TYPE
    },
  ],
  KeySchema: [
    {
      AttributeName: 'id', //ATTRIBUTE_NAME_1
      KeyType: 'HASH',
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
  GlobalSecondaryIndexes: [
    {
      IndexName: 'email',
      KeySchema: [
        {
          AttributeName: 'email',
          KeyType: 'HASH',
        },
      ],
      Projection: { ProjectionType: 'ALL' },
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    },
  ],
  TableName: 'customers', //TABLE_NAME
  StreamSpecification: {
    StreamEnabled: false,
  },
}

export interface ICustomer {
  id: string
  email: string
  name: string
  password: string
}
