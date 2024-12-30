import mongoose, { model, Schema} from "mongoose";

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