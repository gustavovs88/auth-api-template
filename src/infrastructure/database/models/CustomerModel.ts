// Set the parameters
export const customerTableParams = {
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
    },
  ],
  TableName: 'customers', //TABLE_NAME
  StreamSpecification: {
    StreamEnabled: false,
  },
  BillingMode: 'PAY_PER_REQUEST',
}

export interface ICustomer {
  id: string
  email: string
  name: string
  password: string
}
