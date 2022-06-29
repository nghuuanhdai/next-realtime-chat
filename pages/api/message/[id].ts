import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../utils/dbConnect";
import { NextApiResponseServerIO } from "../../../types/next";

import jwt from 'jsonwebtoken'
import { IAccessTokenData } from "../login";
import MessageDBO from "../../../models/message";
import UserDBO from "../../../models/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO) {
  
  await dbConnect()
  const token:string = req.cookies.accessToken
  const decodedToken:(IAccessTokenData|undefined) = jwt.verify(token, process.env.JWT_SECRET??'') as IAccessTokenData
  if(!decodedToken)
    return res.status(403).end()

  const userId = decodedToken.userId
  let { id: recipientId } = req.query;
  if(Array.isArray(recipientId))
    recipientId = recipientId[0]
  const userArr = [userId, recipientId]
  userArr.sort()
  const [user1Id, user2Id] = userArr
  
  if(req.method==='GET') {  
    const messages = await MessageDBO.find({ user1: user1Id, user2: user2Id}).populate('sender').exec()
    res.json({
      messages: messages
    })
  }

  if(req.method==='POST') {
    const [message, userUpdateResult, recipientUpdateResult] = await Promise.all([
      new MessageDBO({
        sender: userId,
        sendTime: new Date(),
        message: req.body.message,
        user1: user1Id,
        user2: user2Id
      }).save(),
      UserDBO.findByIdAndUpdate(userId, {
        $addToSet: { conversations: recipientId }
      }),
      UserDBO.findByIdAndUpdate(recipientId, {
        $addToSet: { conversations: userId }
      })
    ])
    const newConversation = userUpdateResult['$isNew'] || recipientUpdateResult['$isNew']
    await message.populate('sender')
    const socketPayload = {
      message: message,
      senderId: userId
    }
    //notify other socket connection
    const currentSocket = res?.socket?.server?.connectedSockets[userId]
    currentSocket?.emit('message', JSON.stringify(socketPayload))
    const otherSocket = res?.socket?.server?.connectedSockets[recipientId]
    otherSocket?.emit('message', JSON.stringify(socketPayload))
    res.status(201).end()
  }

  return res.status(404).end()
}