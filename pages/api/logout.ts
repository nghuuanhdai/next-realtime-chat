import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader('Clear-Site-Data', "\"cookies\"");
  res.redirect(303,'/login')
}
