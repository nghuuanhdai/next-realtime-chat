import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../utils/dbConnect";

import jwt from 'jsonwebtoken'
import { IAccessTokenData } from "./login";
import ConversationDBO from "../../models/conversation";

function getOtherUser(conv:any, currentUserId:string):any {
  let user = conv.user1
  if(user._id.toString() === currentUserId)
    user = conv.user2
  return {
    _id: user._id,
    username: user.username
  }
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse) {
  
  if(req.method==='GET') {
    await dbConnect()
    const token:string = req.cookies.accessToken
    const decodedToken:(IAccessTokenData|undefined) = jwt.verify(token, process.env.JWT_SECRET??'') as IAccessTokenData
    if(!decodedToken)
      return res.status(403).end()

    const conversations = await ConversationDBO.find({
      $or: [
        {user1: decodedToken.userId},
        {user2: decodedToken.userId}
      ]
    }).populate('user1 user2')

    return res.json({
      conversations: conversations.map(conv => (
        {
          _id: conv._id,
          otherUser: getOtherUser(conv, decodedToken.userId)
        }
      ))
    })
  }

  return res.status(404).end()
}