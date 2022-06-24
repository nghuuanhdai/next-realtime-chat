import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../utils/dbConnect'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await dbConnect()
  //TODO handle cookie section clear
  res.redirect(307,'/login')
}
