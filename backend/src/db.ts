import mongoose, { model, Schema} from "mongoose";

mongoose.connect("mongodb://localhost:27017/Brainly")

const UserSchema = new Schema({
    username: {type: String, unique: true},
    email: {type: String, required: true, unique: true },
    password: {type: String, required: true}
})

export const UserModel = model("User", UserSchema);