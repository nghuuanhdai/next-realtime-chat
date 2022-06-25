import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "../../types/next";

export default async function hander (req: NextApiRequest, res: NextApiResponseServerIO) {
  if (req.method === "POST") {
    const message = req.body.message;
    res?.socket?.server?.io?.emit("message", message);
    res.status(201).json(message);
  }
};