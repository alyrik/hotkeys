import { Server } from 'socket.io';
import type { NextApiRequest, NextApiResponse } from 'next';

import { SocketEvent } from '../../models/SocketEvent';
import dataService from '../../services/countService';

const handler = (
  req: NextApiRequest,
  res: NextApiResponse & { socket: { server: any } },
) => {
  if (!res.socket?.server?.io) {
    console.log('*First use, starting socket.io');

    const io = new Server(res.socket.server);

    io.on('connection', (socket) => {
      socket.on(SocketEvent.UpdateCount, (msg) => {
        dataService.setCount(msg);
        socket.broadcast.emit(SocketEvent.ReceiveUpdateCount, msg);
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
