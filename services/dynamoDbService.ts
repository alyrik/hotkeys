import {
  DynamoDBClient,
  GetItemCommand,
  GetItemInput,
  ScanCommand,
  ScanCommandInput,
  ScanCommandOutput,
  UpdateItemCommand,
  UpdateItemCommandInput,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

interface IBaseParams {
  tableName: string;
}

interface IScanParams extends IBaseParams {}

interface IFindOneParams extends IBaseParams {}

interface IUpdateParams extends IBaseParams {}

interface IUpdateInstructions
  extends Pick<
    UpdateItemCommandInput,
    | 'UpdateExpression'
    | 'ExpressionAttributeNames'
    | 'ExpressionAttributeValues'
  > {}

class DynamoDbService {
  public marshall = marshall;
  public unmarshall = unmarshall;

  private client = new DynamoDBClient({ region: process.env.AWS_REGION });

  async scan<TData>({ tableName }: IScanParams) {
    const results: ScanCommandOutput['Items'] = [];
    const commandInput: ScanCommandInput = {
      TableName: tableName,
    };

    let output;

    do {
      const command = new ScanCommand(commandInput);
      output = await this.client.send(command);
      output.Items?.forEach((item) => results.push(item));
      commandInput.ExclusiveStartKey = output.LastEvaluatedKey;
    } while (typeof output.LastEvaluatedKey !== 'undefined');

    return results.map((item) => this.unmarshall(item) as TData);
  }

  async findOne(query: GetItemInput['Key'], { tableName }: IFindOneParams) {
    const command = new GetItemCommand({
      Key: query,
      TableName: tableName,
    });

    const data = await this.client.send(command);

    return data.Item ? this.unmarshall(data.Item) : {};
  }

  async update(
    // id: {
    //   S: id,
    // },
    query: UpdateItemCommandInput['Key'],
    // UpdateExpression: 'set #tasks = :tasks, #updatedAt = :updatedAt',
    // ExpressionAttributeNames: {
    //   '#tasks': 'tasks',
    //   '#updatedAt': 'updatedAt',
    // },
    // ExpressionAttributeValues: {
    //   ':tasks': marshall({ tasks: updateUserTaskDto }).tasks,
    //   ':updatedAt': { N: String(Date.now()) },
    // },
    updateInstructions: IUpdateInstructions,
    { tableName }: IUpdateParams,
  ) {
    const command = new UpdateItemCommand({
      Key: query,
      ...updateInstructions,
      TableName: tableName,
    });

    return this.client.send(command);
  }
}

export default new DynamoDbService();
