import mongoose, { model, Schema } from "mongoose";

interface IMessage{
  sender: Schema.Types.ObjectId;
  sendTime: Date;
  message: string;
  conversationId: Schema.Types.ObjectId;
}

const messageSchema = new Schema<IMessage>({
  sender: {type: Schema.Types.ObjectId, ref: 'User'},
  sendTime: {type: Date, require: true},
  message: {type: String, require: true},
  conversationId: {type: Schema.Types.ObjectId, ref: 'Conversation'}
});

const MessageDBO = mongoose.models.Message || model<IMessage>('Message', messageSchema)
export default MessageDBO