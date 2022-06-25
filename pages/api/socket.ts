import { NextApiRequest } from "next/types";

import { Server as ServerIO } from "socket.io";
import { NextApiResponseServerIO } from "../../types/next";

import cookie from 'cookie'
import jwt from 'jsonwebtoken'
import { IAccessTokenData } from "./login";

export default function hander(
  req: NextApiRequest,
  res: NextApiResponseServerIO) {
    if(!res.socket.server.io){
      console.log('Socket is initializing')
      const io = new ServerIO(res.socket.server)
      const server = res.socket.server
      server.io = io
      io.on('connection', (socket)=>{
        const cookies = cookie.parse(socket.client.request.headers.cookie??'')
        const decodedToken:IAccessTokenData|null = jwt.verify(cookies.accessToken??'', process.env.JWT_SECRET??'') as IAccessTokenData
        if(!decodedToken)
          socket.disconnect()
        if (!server.connectedSockets)
          server.connectedSockets = {}
        server.connectedSockets[decodedToken.userId] = socket
      })
    }
    res.end()
}