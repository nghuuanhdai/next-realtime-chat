import { NextApiRequest, NextApiResponse } from "next/types";
import UserDBO from "../../../models/user";
import dbConnect from "../../../utils/dbConnect";

export default async function hander(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if(req.method === 'GET')
  {
    let {username: usernameQuery} = req.query
    if (Array.isArray(usernameQuery))
      usernameQuery = usernameQuery[0]

    await dbConnect()
    const users = await UserDBO.find(
      {
        $or: [
          {username: {$regex : "^" + usernameQuery}}, 
          {email: {$regex : "^" + usernameQuery}}
        ]
      }).limit(100)
    
    return res.json({
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