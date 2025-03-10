import mongoose, { model, Schema } from "mongoose"
import dotenv from 'dotenv'

dotenv.config();
const url = process.env.MONGOLAB_URI as string

mongoose.connect(url);

const UserSchema = new Schema({
    username: {type: String , unique: true},
    password: String
});

export const UserModel = model("user", UserSchema);

const TodoSchema = new Schema({
    title: String,
    done: Boolean,
    description: String,
    userId: { type: mongoose.Types.ObjectId, ref: 'user', requrired: true}
});

export const TodoModel = model("todo", TodoSchema);
