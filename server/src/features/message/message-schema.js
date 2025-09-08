import mongoose from "mongoose";
import { Schema } from "mongoose";


// userschema
const messageschema = new Schema({
     user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
    message:String,
    timeStamp:String
});

export const messageModel =  mongoose.model("messages",messageschema);
