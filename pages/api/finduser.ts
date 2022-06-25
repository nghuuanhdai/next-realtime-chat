import { NextApiRequest, NextApiResponse } from "next/types";
import UserDBO from "../../models/user";
import dbConnect from "../../utils/dbConnect";

export default async function hander(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if(req.method === 'POST')
  {
    await dbConnect()
    const usernameQuery = req.body.username

    const users = await UserDBO.find(
      {
        $or: [
          {username: {$regex : "^" + usernameQuery}}, 
          {email: {$regex : "^" + usernameQuery}}
        ]
      }).limit(100)
    
    res.json({
      users: users.map(user => (
        {
        _id: user._id.toString(),
        username: user.username,
        }
      ))
    })
  }
  res.status(404).end()
}