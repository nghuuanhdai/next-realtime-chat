export interface IUser{
  _id: string,
  username: string,
}

export interface IConversation{
  _id: string,
  otherUser: IUser,
}

export interface IConversationData{
  messages: IMessage[]
}

export interface IMessage{
  _id: string,
  fromUser: IUser,
  toUser: IUser,
  time: Date
  message: string
}