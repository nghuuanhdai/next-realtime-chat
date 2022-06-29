import mongoose, { model, Schema } from "mongoose";

interface IMessage{
  sender: Schema.Types.ObjectId;
  sendTime: Date;
  message: string;
  user1: Schema.Types.ObjectId;
  user2: Schema.Types.ObjectId;
}

const messageSchema = new Schema<IMessage>({
  sender: {type: Schema.Types.ObjectId, ref: 'User'},
  sendTime: {type: Date, require: true},
  message: {type: String, require: true},
  user1: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  user2: {type: Schema.Types.ObjectId, ref: 'User', required: true},
});

const MessageDBO = mongoose.models.Message || model<IMessage>('Message', messageSchema)
export default MessageDBO