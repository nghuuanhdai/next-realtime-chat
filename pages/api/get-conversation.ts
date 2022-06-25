import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../utils/dbConnect";

import jwt from 'jsonwebtoken'
import { IAccessTokenData } from "./login";
import ConversationDBO from "../../models/conversation";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse) {
  
  if(req.method==='POST') {
    await dbConnect()
    const token:string = req.cookies.accessToken
    const decodedToken:(IAccessTokenData|undefined) = jwt.verify(token, process.env.JWT_SECRET??'') as IAccessTokenData
    if(!decodedToken)
      return res.status(403).end()
    const u1Id: string = req.body.u1Id;
    const u2Id: string = req.body.u2Id;
    if(![u1Id, u2Id].includes(decodedToken.userId))
      return res.status(403).end()
    
    let conversation = await ConversationDBO.findOne({
      $or: [
        {user1: u1Id, user2: u2Id},
        {user1: u2Id, user2: u1Id}
      ]
    })

    if(!conversation)
    {
      conversation = new ConversationDBO({
        user1: u1Id,
        user2: u2Id
      })
      await conversation.save()
    }
    return res.json({
      conversationId: conversation._id
    })
  }

  return res.status(404).end()
}