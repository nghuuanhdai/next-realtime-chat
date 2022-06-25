import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../utils/dbConnect";

import jwt from 'jsonwebtoken'
import { IAccessTokenData } from "./login";
import ConversationDBO from "../../models/conversation";
import MessageDBO from "../../models/message";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse) {
  
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
      
    const messages = await MessageDBO
      .find({conversationId: conversation._id})
      .populate('sender')
      .exec()
    
    res.json({
      messages: messages
    })
  }

  return res.status(404).end()
}