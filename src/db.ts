import mongoose, { model, Schema } from "mongoose"

mongoose.connect("");

const UserSchema = new Schema({
    username: {type: String , unique: true},
    password: String
});

export const UserModel = model("user", UserSchema);

const TodoSchema = new Schema({
    title: String,
    done: Boolean,
    description: String,
    userId: { type: mongoose.Types.ObjectId, ref: 'user', required: true}
});

export const TodoModel = model("todo", TodoSchema);
