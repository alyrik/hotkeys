import {
  GetQueueAttributesCommand,
  SendMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { QueueAttributeName } from '@aws-sdk/client-sqs/dist-types/models/models_0';

class SqsService {
  private client = new SQSClient({ region: process.env.AWS_REGION });

  async sendMessage<TData>(msg: TData) {
    const command = new SendMessageCommand({
      QueueUrl: process.env.AWS_SQS_RESPONSE_URL,
      MessageBody: JSON.stringify(msg),
    });
    return this.client.send(command);
  }

  async getQueueAttributes(attributes: QueueAttributeName[]) {
    const command = new GetQueueAttributesCommand({
      QueueUrl: process.env.AWS_SQS_RESPONSE_URL,
      AttributeNames: attributes,
    });
    const data = await this.client.send(command);

    return data.Attributes ?? {};
  }
}

export default new SqsService();
