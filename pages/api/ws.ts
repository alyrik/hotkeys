import { Server } from 'socket.io';
import type { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';

import { SocketEvent } from '../../models/SocketEvent';
import localDataService from '../../services/localDataService';
import { SocketEventData } from '../../models/SocketEventData';
import { CookieKey } from '../../models/CookieKey';
import sqsService from '../../services/sqsService';
import dynamoDbService from '../../services/dynamoDbService';
import { GetQueueAttributesResult } from '@aws-sdk/client-sqs';
import analyticsService, { IInputData } from '../../services/analyticsService';

function isEmptyQueue(attributes: GetQueueAttributesResult['Attributes']) {
  return (
    attributes?.ApproximateNumberOfMessages === '0' &&
    attributes?.ApproximateNumberOfMessagesDelayed === '0' &&
    attributes?.ApproximateNumberOfMessagesNotVisible === '0'
  );
}

const handler = (
  req: NextApiRequest,
  res: NextApiResponse & { socket: { server: any } },
) => {
  if (!res.socket?.server?.io) {
    console.log('*First use, starting socket.io');

    const io = new Server(res.socket.server);

    io.on('connection', (socket) => {
      const userId = parse(socket.handshake.headers.cookie ?? '')?.[
        CookieKey.UserId
      ];
      const isAdmin = userId === process.env.ADMIN_TOKEN;

      socket.join(userId);

      socket.on(SocketEvent.UpdateCount, (msg: number) => {
        localDataService.setCount(msg);

        if (msg === 0) {
          localDataService.setRawInputData(null!);
          localDataService.setAnalytics(null!);
        }

        socket.broadcast.emit(SocketEvent.ReceiveUpdateCount, msg);
      });

      socket.on(
        SocketEvent.SaveResponse,
        async (msg: SocketEventData[SocketEvent.SaveResponse]) => {
          try {
            await sqsService.sendMessage<typeof msg>(
              msg,
              String(msg.questionId),
            );
          } catch (e) {
            // TODO: push to cloudwatch
            console.log('SQS FAILED', e);
          }
        },
      );

      socket.on(SocketEvent.PrepareResults, async () => {
        if (!isAdmin) {
          return;
        }

        let checksCount = 0;

        const interval = setInterval(async () => {
          const attributes = await sqsService.getQueueAttributes([
            'ApproximateNumberOfMessages',
            'ApproximateNumberOfMessagesDelayed',
            'ApproximateNumberOfMessagesNotVisible',
          ]);

          if (isEmptyQueue(attributes)) {
            checksCount += 1;

            if (checksCount >= 10) {
              clearInterval(interval);

              const data = await dynamoDbService.scan<IInputData>();
              localDataService.setRawInputData(data);
              const analyticsData = analyticsService.prepare(data);
              localDataService.setAnalytics(analyticsData);

              io.emit(SocketEvent.ReceiveAnalyticsData, analyticsData);
            }
          }
        }, 1000);
      });

      socket.on(SocketEvent.PrepareIndividualResults, () => {
        if (isAdmin) {
          return;
        }

        const data = localDataService.getRawInputData();

        if (data) {
          const individualAnalyticsData = analyticsService.prepareIndividual(
            data,
            userId,
          );

          io.to(userId).emit(
            SocketEvent.ReceiveIndividualAnalyticsData,
            individualAnalyticsData,
          );
        }
      });
    });

    res.socket.server.io = io;
  } else {
    console.log('socket.io already running');
  }
  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
