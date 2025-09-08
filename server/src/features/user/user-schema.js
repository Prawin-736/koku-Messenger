import mongoose from "mongoose";
import { Schema } from "mongoose";


// userschema
const userschema = new Schema({
     username: {
    type: String,
  },
    profilepicture: {
    type: String,
  },
   displayMode: {
    type: String,
    enum: ['light', 'dark'],
    default: 'light'
  } , token: 
    {
      token: {
        type: String,
      },
      time: {
        type: Date,
      }
    }
})

export const userModel =  mongoose.model("user",userschema);

// userschema
const onlineuserschema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    unique: true
  }
});


export const onlineuserModel =  mongoose.model("onlineusers",onlineuserschema);

