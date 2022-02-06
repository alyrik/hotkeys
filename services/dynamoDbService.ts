import {
  DynamoDBClient,
  ScanCommand,
  ScanCommandInput,
  ScanCommandOutput,
} from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

class DynamoDbService {
  private tableName = process.env.AWS_TABLE;
  private client = new DynamoDBClient({ region: process.env.AWS_REGION });

  async scan<TData>() {
    const results: ScanCommandOutput['Items'] = [];
    const commandInput: ScanCommandInput = {
      TableName: this.tableName,
    };

    let output;

    do {
      const command = new ScanCommand(commandInput);
      output = await this.client.send(command);
      output.Items?.forEach((item) => results.push(item));
      commandInput.ExclusiveStartKey = output.LastEvaluatedKey;
    } while (typeof output.LastEvaluatedKey !== 'undefined');

    return results.map((item) => unmarshall(item) as TData);
  }
}

export default new DynamoDbService();
