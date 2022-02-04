const SDK = require('@aws-sdk/client-dynamodb');
const sdkUtils = require('@aws-sdk/util-dynamodb');
const uuid = require('uuid').v4;

const client = new SDK.DynamoDBClient({ region: 'eu-central-1' });

exports.handler = async ({ questionId, userId, answer }) => {
  if (!questionId || !userId || !answer) {
    console.log('Empty event, skipping');
    return;
  }

  const command = new SDK.PutItemCommand({
    Item: sdkUtils.marshall({
      id: uuid(),
      createdAt: Date.now(),
      questionId,
      userId,
      answer,
    }),
    TableName: process.env.AWS_TABLE,
  });

  await client.send(command);

  return {
    statusCode: 200,
  };
};
