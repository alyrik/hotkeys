const SDK = require('@aws-sdk/client-dynamodb');
const sdkUtils = require('@aws-sdk/util-dynamodb');
const uuid = require('uuid').v4;

const client = new SDK.DynamoDBClient({ region: 'eu-central-1' });
const chunkSize = 25;

async function batchWrite(group) {
  const command = new SDK.BatchWriteItemCommand({
    RequestItems: {
      [process.env.AWS_TABLE]: group.map((groupItem) => ({
        PutRequest: {
          Item: groupItem,
        },
      })),
    },
  });

  const response = await client.send(command);
  console.log('RESPONSE', response);
}

function prepareItem(item) {
  let parsedBody;

  try {
    parsedBody = JSON.parse(item.body);
  } catch (e) {
    console.log('Empty body, skipping');
    return null;
  }

  if (
    !parsedBody ||
    !parsedBody.questionId ||
    !parsedBody.userId ||
    !parsedBody.answer
  ) {
    console.log('Empty body, skipping');
    return null;
  }

  return sdkUtils.marshall({
    id: uuid(),
    createdAt: Date.now(),
    questionId: parsedBody.questionId,
    userId: parsedBody.userId,
    answer: parsedBody.answer,
  });
}

function prepareGroups(records) {
  if (!records.length) {
    return [];
  }

  return records.reduce((result, item, index) => {
    const chunkIndex = Math.floor(index / chunkSize);

    if (!result[chunkIndex]) {
      result[chunkIndex] = [];
    }

    const preparedItem = prepareItem(item);

    if (!preparedItem) {
      return result;
    }

    result[chunkIndex].push(preparedItem);

    return result;
  }, []);
}

exports.handler = async (event) => {
  // TODO: handle failed items
  const groups = prepareGroups(event.Records);
  const promises = groups.map((group) => batchWrite(group));

  await Promise.all(promises);

  return {
    statusCode: 200,
  };
};
