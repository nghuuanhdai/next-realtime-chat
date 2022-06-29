import mongoose, { model, Schema } from "mongoose";

interface IUser{
  username: string;
  email: string;
  password: string;
  conversations: Schema.Types.ObjectId[]
}

const userSchema = new Schema<IUser>({
  username: {type: String, require: true},
  email: {type: String, require: true},
  password: {type: String, require: true},
  conversations: [{type: Schema.Types.ObjectId, ref: 'User'}]
});

const UserDBO = mongoose.models.User || model<IUser>('User', userSchema)
export default UserDBO