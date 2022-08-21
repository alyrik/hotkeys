import type { NextApiRequest, NextApiResponse } from 'next';

import dynamoDbService from '@/services/dynamoDbService';
import { CookieKey } from '@/config/cookies';
import { IUsernameDto } from '@/models/dto/UsernameAnswerDto';

async function handleSaveUsername({ username }: IUsernameDto, userId: string) {
  const UpdateExpression = 'set updatedAt = :updatedAt, username = :username';
  const usernameValue = { S: username || '' };
  const ExpressionAttributeValues = {
    ':updatedAt': { N: String(Date.now()) },
    ':username': usernameValue,
  };

  return dynamoDbService.update(
    { userId: { S: userId } },
    {
      UpdateExpression,
      ExpressionAttributeValues,
    },
    { tableName: process.env.AWS_TABLE_INDIVIDUAL! },
  );
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'POST':
      try {
        await handleSaveUsername(req.body, req.cookies[CookieKey.UserId]!);
        res.status(200).end();
      } catch (e) {
        console.error(e);
        res.status(500).end();
      }
      break;
    default:
      res.status(405).end('Method Not Allowed');
  }
};

export default handler;
