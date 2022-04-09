import type { NextApiRequest, NextApiResponse } from 'next';

import { IIndividualAnswerDto } from '@/models/dto/IndividualAnswerDto';
import { CookieKey } from '@/models/CookieKey';
import dynamoDbService from '@/services/dynamoDbService';
import { FormValue } from '@/models/FormValue';
import { buildScreenNumberCookie } from '@/helpers/buildCookie';

async function handleSaveIndividualAnswer(
  { answer, questionId }: IIndividualAnswerDto,
  userId: string,
) {
  const isFirstQuestion = questionId === 1;

  const UpdateExpression = `set updatedAt = :updatedAt, answers${
    isFirstQuestion ? '' : `[${questionId}]`
  } = ${isFirstQuestion ? ':firstAnswer' : ':answer'}`;
  const answerValue = { S: answer || FormValue.Never };
  const ExpressionAttributeValues = {
    ':updatedAt': { N: String(Date.now()) },
    [isFirstQuestion ? ':firstAnswer' : ':answer']: isFirstQuestion
      ? {
          L: [answerValue],
        }
      : answerValue,
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
        await handleSaveIndividualAnswer(
          req.body,
          req.cookies[CookieKey.UserId],
        );
        res.setHeader(
          'Set-Cookie',
          buildScreenNumberCookie(
            req.body.questionId + 1,
            process.env.NODE_ENV === 'production',
          ),
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
