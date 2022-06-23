export interface IUser{
  _id: string,
  userName: string
}

export interface IMessageData {
  messages: IMessage[]
}

export interface IMessage{
  _id: string
  user: IUser,
  message: string,
  time: Date
}