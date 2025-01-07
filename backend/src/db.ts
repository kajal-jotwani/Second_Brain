import mongoose, { model, Schema} from "mongoose";
import { string } from "zod";

mongoose.connect("mongodb://localhost:27017/Brainly")

const UserSchema = new Schema({
    username: {type: String, unique: true},
    email: {type: String, required: true, unique: true },
    password: {type: String, required: true}
})

export const UserModel = model("User", UserSchema);

const ContentSchema = new Schema({
    tittle: String,
    link: String,
    tags: [{type: mongoose.Types.ObjectId, ref: 'Tag'}],
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true}
})

export const Contentmodel = model("Content", ContentSchema);

const LinkSchema = new Schema({
    // a unique string which is generated for the user
    hash: String,
    // the type is userid but it refers to the user table
    userId: {type: mongoose.Types.ObjectId, ref:'User', require, unique: true}
})

export const LinkModel = model("Links", LinkSchema);