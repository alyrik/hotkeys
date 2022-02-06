import { Server } from 'socket.io';
import type { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';

import { SocketEvent } from '../../models/SocketEvent';
import localDataService from '../../services/localDataService';
import { SocketEventData } from '../../models/SocketEventData';
import { CookieKey } from '../../models/CookieKey';
import sqsService from '../../services/sqsService';
import dynamoDbService from '../../services/dynamoDbService';

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

      socket.on(SocketEvent.UpdateCount, (msg: number) => {
        localDataService.setCount(msg);
        socket.broadcast.emit(SocketEvent.ReceiveUpdateCount, msg);
      });

      socket.on(
        SocketEvent.SaveResponse,
        async (msg: SocketEventData[SocketEvent.SaveResponse]) => {
          if (msg) {
            await sqsService.sendMessage<typeof msg>(msg);
          }
        },
      );

      socket.on(SocketEvent.PrepareResults, async () => {
        if (!isAdmin) {
          return;
        }

        const interval = setInterval(async () => {
          const attributes = await sqsService.getQueueAttributes([
            'ApproximateNumberOfMessages',
            'ApproximateNumberOfMessagesDelayed',
            'ApproximateNumberOfMessagesNotVisible',
          ]);

          console.log(
            'attributes.ApproximateNumberOfMessages',
            attributes.ApproximateNumberOfMessages,
          );
          console.log(
            'attributes.ApproximateNumberOfMessagesDelayed',
            attributes.ApproximateNumberOfMessagesDelayed,
          );
          console.log(
            'attributes.ApproximateNumberOfMessagesNotVisible',
            attributes.ApproximateNumberOfMessagesNotVisible,
          );

          if (
            attributes.ApproximateNumberOfMessages === '0' &&
            attributes.ApproximateNumberOfMessagesDelayed === '0' &&
            attributes.ApproximateNumberOfMessagesNotVisible === '0'
          ) {
            // TODO fetch from Dynamo and prepare analysis — save into local storage
            const data = await dynamoDbService.scan();
            console.log('HAVING DATA', data.length);
            clearInterval(interval);
            setTimeout(async () => {
              const data = await dynamoDbService.scan();
              console.log('HAVING DATA 2', data.length);
            }, 1000);
          }
        }, 1000);
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
