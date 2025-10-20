import ErrorHandler from "../../middleware/error-handler.js";
import { messageModel } from "./message-schema.js";
import { generateSignedUrl } from "../../../aws/s3SignedUrl.js";


export default class MessageRepository {

  //function for getting formatted date and time for message.
    static formatDateTime(timeStamp) {
    const now = new Date();

    const formattedTime = timeStamp.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    });

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const inputDate = new Date(timeStamp.getFullYear(), timeStamp.getMonth(), timeStamp.getDate());

    if (inputDate.getTime() === today.getTime()) {
      return `Today, ${formattedTime}`;
    } else if (inputDate.getTime() === yesterday.getTime()) {
      return `Yesterday, ${formattedTime}`;
    } else {
      const day = timeStamp.getDate();
      const month = timeStamp.toLocaleString('en-US', { month: 'short' });
      return `${day} ${month}, ${formattedTime}`;
    }
  }


   async  postMessage(userId,messageText,timeStamp){

    try{
      
const message = new messageModel({user:userId,message:messageText,timeStamp:timeStamp})
await message.save();
 const populateMsg = await message.populate('user');
 const populateMsgObject = populateMsg.toObject();

  // formating timestamp
 populateMsgObject.timeStamp = MessageRepository.formatDateTime(new Date(populateMsgObject.timeStamp));

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


    async deleteMessage(messageId){
      try{
    const message = await messageModel.updateOne(
      { _id: messageId },
      { $unset: { message: "" } }
    );
    return message;
      }catch(err){
    console.error("deleteMessage repository Error: ", err);
    throw new ErrorHandler("Something went wrong with the database.", 500);
      }
    }


async getAllMessages() {
  try {
    const messages = await messageModel.find().populate('user');
    const messagesObj = messages.map((message) => message.toObject());
    // Iterating over messages and format
    for (const message of messagesObj) {
      const timeStamp = new Date(message.timeStamp);
        message.timeStamp = MessageRepository.formatDateTime(timeStamp);
    
      // Signed URL generation for profile picture
      const profilePicUrl = message.user?.profilepicture;

      if (profilePicUrl) {
          const url = new URL(profilePicUrl);
          const profilePictureKey = url.pathname.slice(1);

          const profilePictureSignedUrl = await generateSignedUrl(profilePictureKey);
          message.user.profilepicture = profilePictureSignedUrl;
      
        } else {
        // No profile picture provided
        message.user.profilepicture = null;
      }
    }

    return messagesObj;

  } catch (err) {
    console.error("getAllMessages repository Error: ", err);
    throw new ErrorHandler("Something went wrong with the database.", 500);
  }
}

 }
