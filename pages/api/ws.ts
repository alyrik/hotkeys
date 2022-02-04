import { Server } from 'socket.io';
import type { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

import { SocketEvent } from '../../models/SocketEvent';
import localDataService from '../../services/localDataService';
import { SocketEventData } from '../../models/SocketEventData';
import { CookieKey } from '../../models/CookieKey';

const client = new SQSClient({ region: process.env.AWS_REGION });

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
            const command = new SendMessageCommand({
              QueueUrl: process.env.AWS_SQS_RESPONSE_URL,
              MessageBody: JSON.stringify(msg),
            });
            await client.send(command);
          }
        },
      );
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
