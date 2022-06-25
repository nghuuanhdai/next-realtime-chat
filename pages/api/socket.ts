import { NextApiRequest } from "next/types";

import { Server as ServerIO } from "socket.io";
import { NextApiResponseServerIO } from "../../types/next";

import cookie from 'cookie'
import jwt from 'jsonwebtoken'

export default function hander(
  req: NextApiRequest,
  res: NextApiResponseServerIO) {
    if(!res.socket.server.io){
      console.log('Socket is initializing')
      const io = new ServerIO(res.socket.server)
      res.socket.server.io = io
      io.on('connection', (socket)=>{
        const cookies = cookie.parse(socket.client.request.headers.cookie??'')
        const decodedToken:string = jwt.verify(cookies.accessToken??'', process.env.JWT_SECRET??'') as string
        if(!decodedToken)
          socket.disconnect()
      })
    }
    res.end()
}