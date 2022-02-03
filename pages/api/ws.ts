import { Server } from 'socket.io';
import type { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';

import { SocketEvent } from '../../models/SocketEvent';
import localDataService from '../../services/localDataService';
import { SocketEventData } from '../../models/SocketEventData';
import { CookieKey } from '../../models/CookieKey';

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
        SocketEvent.SaveAnswer,
        (msg: SocketEventData[SocketEvent.SaveAnswer]) => {
          console.log('SAVE ANSWER', msg);
          // TODO
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
