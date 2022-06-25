import { Socket } from "net";
import { Server as SocketIOServer } from "socket.io";
import { Server as NetServer } from "http";
import { NextApiResponse } from "next/types";

export type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};