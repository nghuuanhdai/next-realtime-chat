import mongoose, { Schema, model } from "mongoose";

interface IConversation{
  user1: Schema.Types.ObjectId,
  user2: Schema.Types.ObjectId,
}

const conversationSchema = new Schema<IConversation>({
  user1: {type: Schema.Types.ObjectId, require: true, ref: 'User', autopopulate: true},
  user2: {type: Schema.Types.ObjectId, require: true, ref: 'User', autopopulate: true},
})

const ConversationDBO = mongoose.models.Conversation || model<IConversation>('Conversation', conversationSchema)
export default ConversationDBO