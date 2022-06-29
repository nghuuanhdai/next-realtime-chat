import { NextApiRequest, NextApiResponse } from "next/types";
import jwt from 'jsonwebtoken'
import { IAccessTokenData } from "../login";
import UserDBO from "../../../models/user";
import dbConnect from "../../../utils/dbConnect";

export default async function hander(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if(req.method === 'GET')
  {
    await dbConnect()
    const token:string = req.cookies.accessToken
    const decodedToken:(IAccessTokenData|undefined) = jwt.verify(token, process.env.JWT_SECRET??'') as IAccessTokenData
    if(!decodedToken)
      return res.status(403).end()
    const user = await UserDBO.findById(decodedToken.userId).populate('conversations')
    return res.json(user)
  }
  res.status(404).end()
}