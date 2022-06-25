import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../utils/dbConnect";
import { NextApiResponseServerIO } from "../../types/next";

import jwt from 'jsonwebtoken'
import { IAccessTokenData } from "./login";
import ConversationDBO from "../../models/conversation";
import MessageDBO from "../../models/message";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO) {
  
  if(req.method==='POST') {
    await dbConnect()
    const token:string = req.cookies.accessToken
    const decodedToken:(IAccessTokenData|undefined) = jwt.verify(token, process.env.JWT_SECRET??'') as IAccessTokenData
    if(!decodedToken)
      return res.status(403).end()
    const conversation = await ConversationDBO.findById(req.body.conversationId)
    if(!conversation)
      return res.status(404).end()
    if(![conversation.user1.toString(), conversation.user2.toString()].includes(decodedToken.userId))
      return res.status(403).end()
      
    const message = new MessageDBO({
      sender: decodedToken.userId,
      sendTime: new Date(),
      message: req.body.message,
      conversationId: conversation._id
    })
    
    await message.save()
    await message.populate('sender')
    //notify other socket connection
    const currentSocket = res?.socket?.server?.connectedSockets[decodedToken.userId]
    currentSocket?.emit('message', JSON.stringify(message))
    const otherUserId:string = [conversation.user1, conversation.user2].find(user => user != decodedToken.userId)
    const otherSocket = res?.socket?.server?.connectedSockets[otherUserId]
    otherSocket?.emit('message', JSON.stringify(message))
    res.status(201).end()
  }

  return res.status(404).end()
}