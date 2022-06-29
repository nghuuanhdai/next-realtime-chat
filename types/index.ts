export interface IUser{
  _id: string,
  username: string,
}

export interface IMessage{
  _id: string,
  sender: IUser,
  sendTime: Date
  message: string
}