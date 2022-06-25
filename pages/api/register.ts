import { NextApiRequest, NextApiResponse } from "next/types"
import UserDBO from "../../models/user";
import dbConnect from "../../utils/dbConnect"
import bcrypt from "bcrypt"


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect()
  
  const username: string = req.body.username;
  const password: string = req.body.password;
  const email   : string = req.body.email;

  const matchUser = await UserDBO.findOne({$or: [{username: username}, {email: email}]})
  if(matchUser)
    return res.redirect(307, `/register?err=${encodeURIComponent('username or email already exist! Choose a different username or email')}`);
  const salt      : string = await bcrypt.genSalt()
  const hashedPass: string = await bcrypt.hash(password, salt);

  const newUser = new UserDBO({
    username: username,
    email: email,
    password: hashedPass
  })
  await newUser.save()
  return res.redirect(307, `/login?info=${encodeURIComponent('user has been created')}`)
}
