import ErrorHandler from "../../middleware/error-handler.js";
import { messageModel } from "./message-schema.js";
import { generateSignedUrl } from "../../../aws/s3SignedUrl.js";


export default class MessageRepository {


   async  postMessage(userId,messageText,timeStamp){
    try{
const message = new messageModel({user:userId,message:messageText,timeStamp:timeStamp})
await message.save();
 const populateMsg = await message.populate('user');
 const populateMsgObject = populateMsg.toObject();
  if (!populateMsgObject.user.profilepicture) {
         return populateMsgObject;
       } else {
         const profilePictureKey = new URL(
           populateMsgObject.user.profilepicture
         ).pathname.slice(1);
         const profilePictureSignedUrl =
           await generateSignedUrl(profilePictureKey);
         populateMsgObject.user.profilepicture = profilePictureSignedUrl;
         return populateMsgObject;
       }

    }catch(err){
        console.log("postMessage repository Error : ",err);
        throw new ErrorHandler("something went wrong with database.",500);
    }
    }


    async getAllMessages(){
      try{
const messages = await messageModel.find().populate('user');
const messagesObj = messages.map((message)=>message.toObject());

for(const message of messagesObj){
if(!message.user?.profilepicture){
    continue;
  }else{
     const profilePictureKey = new URL(
           message.user.profilepicture
         ).pathname.slice(1);
         const profilePictureSignedUrl =
           await generateSignedUrl(profilePictureKey);
         message.user.profilepicture = profilePictureSignedUrl;
}
}
  return messagesObj;

      }catch(err){
        console.log("getAllMessages repository Error : ",err);
        throw new ErrorHandler("something went wrong with database.",500);
      }
    }
}