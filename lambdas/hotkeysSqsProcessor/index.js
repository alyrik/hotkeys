const SDK = require('@aws-sdk/client-dynamodb');
const sdkUtils = require('@aws-sdk/util-dynamodb');
const uuid = require('uuid').v4;

const client = new SDK.DynamoDBClient({ region: 'eu-central-1' });

async function handleEvent(body) {
  let parsedBody;

  try {
    parsedBody = JSON.parse(body);
  } catch (e) {
    console.log('Empty body, skipping');
    return;
  }

  if (
    !parsedBody ||
    !parsedBody.questionId ||
    !parsedBody.userId ||
    !parsedBody.answer
  ) {
    console.log('Empty body, skipping');
    return;
  }

  const command = new SDK.PutItemCommand({
    Item: sdkUtils.marshall({
      id: uuid(),
      createdAt: Date.now(),
      questionId: parsedBody.questionId,
      userId: parsedBody.userId,
      answer: parsedBody.answer,
    }),
    TableName: process.env.AWS_TABLE,
  });

  return client.send(command);
}

exports.handler = async (event) => {
  const promises = event.Records.map((record) => handleEvent(record.body));

  await Promise.all(promises);

  return {
    statusCode: 200,
  };
};
