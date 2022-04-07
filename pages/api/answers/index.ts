import type { NextApiRequest, NextApiResponse } from 'next';

import { IIndividualAnswerDto } from '@/models/dto/IndividualAnswerDto';
import { CookieKey } from '@/models/CookieKey';
import dynamoDbService from '@/services/dynamoDbService';
import { FormValue } from '@/models/FormValue';

async function handleSaveIndividualAnswer(
  answerData: IIndividualAnswerDto,
  userId: string,
) {
  return dynamoDbService.update(
    { userId: { S: userId } },
    {
      UpdateExpression: `set updatedAt = :updatedAt, answers = list_append(if_not_exists(answers, :emptyList), :answer)`,
      ExpressionAttributeValues: {
        ':updatedAt': { N: String(Date.now()) },
        ':answer': {
          L: [{ S: answerData.answer || FormValue.Never }],
        },
        ':emptyList': { L: [] },
      },
    },
    { tableName: process.env.AWS_TABLE_INDIVIDUAL! },
  );
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'POST':
      try {
        await handleSaveIndividualAnswer(
          req.body,
          req.cookies[CookieKey.UserId],
        );
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
