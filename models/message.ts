import { model, Schema } from "mongoose";

interface IMessage{
  senderId: Schema.Types.ObjectId;
  sendTime: Date;
  message: string;
  conversationId: Schema.Types.ObjectId;
}

const messageSchema = new Schema<IMessage>({
  senderId: {type: Schema.Types.ObjectId, ref: 'User', autopopulate: true},
  sendTime: {type: Date, require: true},
  message: {type: String, require: true},
  conversationId: {type: Schema.Types.ObjectId, ref: 'Conversation'}
});

const MessageDBO = model<IMessage>('Message', messageSchema)
export default MessageDBO