import { NextApiRequest, NextApiResponse } from "next";
import UserDBO from "../../models/user";
import dbConnect from "../../utils/dbConnect";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {serialize} from 'cookie'

export interface IAccessTokenData{
  username: string,
  userId: string,
  email: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
){
  await dbConnect()
  
  const username: string = req.body.username
  const password: string = req.body.password


  const user = await UserDBO.findOne({username: username})
  if(!user)
    return res.redirect(307, `/login?err=${encodeURIComponent('incorrect login credential')}`)
  
  const validPassword = await bcrypt.compare(password, user.password)
  if(!validPassword)
    return res.redirect(307, `/login?err=${encodeURIComponent('incorrect login credential')}`)

  const accessTokenData: IAccessTokenData= {
    userId: user._id.toString(),
    username: user.username,
    email: user.email
  }
  if(!process.env.JWT_SECRET)
    return res.status(500).send("INTERNAL ERROR!")

  const accessToken         = jwt.sign(accessTokenData, process.env.JWT_SECRET, {expiresIn: '1d', algorithm: 'HS256'})
  res.setHeader('Set-Cookie', serialize('accessToken', accessToken, { path: '/', httpOnly: true, secure: process.env.NODE_ENV=='development'?false:true}));
  res.redirect(307, '/')
}