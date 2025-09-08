import dotenv from 'dotenv';
dotenv.config();
import { userModel,onlineuserModel } from "./user-schema.js";
import ErrorHandler from "../../middleware/error-handler.js";
import mongoose from 'mongoose';
import path from 'path';
import { s3Client } from '../../../aws/s3Client.js';
import { PutObjectCommand,DeleteObjectCommand } from '@aws-sdk/client-s3';
import { generateSignedUrl } from '../../../aws/s3SignedUrl.js';





export default class UserRepository {


  async addToken(userId,token,time){
    try{
        //adding the token to the user
 const addTokenToUser = await userModel.findByIdAndUpdate(
  userId,{
    $set: {
      token: {
        token: token,
        expiresIn: time,
      },
    },
  },{ new: true } 
);

return addTokenToUser;

    }catch(err){
      console.log("addToken repository Error : ",err);
      throw new ErrorHandler("something went wrong with database",500);
    }
  }

    //getting user tokens 
  async fetchUserToken(userId){  //(CHECKED)
    try{
const user = await userModel.findById(userId);
const userToken = user.token.token;
return userToken;
    }catch(err){
      console.log("fetchUserToken repository Error : ",err);
      throw new ErrorHandler("something went wrong with database",500);
    }
  } 

    async checkUserExsist(username){
    try{
const user = await userModel.exists({username:username});
return user;
    }catch(err){
        console.log("checkUserExsist repository Error : ",err);
        throw new ErrorHandler("somthing went wrong with database.",500);
    }
}

async addUser(username){
    try{
const user = new userModel({username:username});
await user.save();
return user;
    }catch(err){
        console.log("addUser repository Error : ",err);
        throw new ErrorHandler("something went wrong with database.",500);
    }
}

async addOnlineUser(userId){
  try{
    const checkOnlineUser = await onlineuserModel.findOne({user:userId});
    if(!checkOnlineUser){
const onlineUser = new onlineuserModel({user:userId});
await onlineUser.save();
return onlineUser;
    }else{
    return checkOnlineUser;
    }
}catch(err){
    console.log("addOnlineUser repository Error : ",err);
    throw new ErrorHandler("something went wrong with database.",500);
  }
}

async getUser(userId){
try{
const user = await userModel.findById(userId);
 if (!user) {
        throw new ErrorHandler('user not found', 404);
      }
      const userObj = user.toObject();

      if (!userObj.profilepicture) {
        return userObj;
      } else {
        const profilePictureKey = new URL(
          userObj.profilepicture
        ).pathname.slice(1);
        const profilePictureSignedUrl =
          await generateSignedUrl(profilePictureKey);
        userObj.profilepicture = profilePictureSignedUrl;
        return userObj;
      }
}catch(err){
    console.log("getUser repository Error : ",err);
    throw new ErrorHandler("something went wrong with database",500);
}
}
//----------navbar userDetail

//checkes users is already in onlineList
async checkUserOnlineList(userId){
try{
const user = await onlineuserModel.findOne({ user: userId });
return user;
}catch{
  console.log("checkUserOnlineList repository Error : ",err);
  throw new ErrorHandler("something went wrong with databse.",500);
}
}

//fetching all online users excluding current user.
async  currentOnlineUsersEmit(userId) {
  try {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const result = await onlineuserModel.find({ user: { $ne: userObjectId } }).populate('user');

    const resultObjects = await Promise.all(result.map(async (user) => {
      const userObj = user.toObject();

      if (!userObj.user.profilepicture) {
        return userObj;
      } else {
        const profilePictureKey = new URL(
          userObj.user.profilepicture
        ).pathname.slice(1);
        const profilePictureSignedUrl =
          await generateSignedUrl(profilePictureKey);
          console.log(profilePictureSignedUrl);
        userObj.user.profilepicture = profilePictureSignedUrl;
        return userObj;
      }
    }));

    return resultObjects;
  } catch (err) {
    console.log("currentOnlineUser repository Error:", err);
    throw new ErrorHandler("Something went wrong with the database.", 500);
  }
}


//fetching current user
async currentOnlineUser(userId){
  try{
    const result = await userModel.findById(userId);
    const userObj = result.toObject();

      if (!userObj.profilepicture) {
        return userObj;
      } else {
        const profilePictureKey = new URL(
          userObj.profilepicture
        ).pathname.slice(1);
        const profilePictureSignedUrl =
          await generateSignedUrl(profilePictureKey);
          console.log(profilePictureSignedUrl);
        userObj.profilepicture = profilePictureSignedUrl;

        return userObj;
      }
    
  }catch(err){
    console.log("currentOnline repository Error : ",err);
    throw new ErrorHandler("something went wrong with database.",500);
  }
}


//fetching all offline user
async OfflineUserIo() {
  try {
   // online users
    const onlineUsers = await onlineuserModel.find(); 
    // Get list of online user IDs
    const onlineUserIds = onlineUsers.map(user => user.user.toString());

    // Get offline users (users not in online list)
    const offlineUsersPre = await userModel.find({
      _id: { $nin: onlineUserIds }
    });

    // Process offline users to add signed profile picture URLs (if any)
    const offlineUsers = await Promise.all(//important to know
      offlineUsersPre.map(async (user) => {
        const userObj = user.toObject();

        if (!userObj.profilepicture) {
          return userObj;
        } else {
          // Generate signed URL for profile picture
          const profilePictureKey = new URL(userObj.profilepicture).pathname.slice(1);
          const signedUrl = await generateSignedUrl(profilePictureKey);
          userObj.profilepicture = signedUrl;

          return userObj;
        }
      })
    );

    return offlineUsers;

  } catch (err) {
    console.error("OfflineUserIo repository Error:", err);
    throw new ErrorHandler("Something went wrong with the database.", 500);
  }
}


async allUserCounts(){
  try{
    // online users
    const onlineUsers = await onlineuserModel.find(); 
    // all users
    const totalUsers = await userModel.find();        
    // Get list of online user IDs
    const onlineUserIds = onlineUsers.map(user => user.user.toString());

    // Get offline users (users not in online list)
    const offlineUsers = await userModel.find({
      _id: { $nin: onlineUserIds }
    });

   // Counts
    const onlineUserCount = onlineUsers.length;
    const offlineUserCount = offlineUsers.length;
    const totalUserCount = totalUsers.length;

    return {
      onlineUserCount,
      offlineUserCount,
      totalUserCount
    };

  }catch(err){
    console.log("allUserCounts repository Error : ",err);
    throw new ErrorHandler("something went wrong with database.",500);
  }
}


//----------navbar userDetail--------------//
// Gets online users
async onlineUsers() {
  try {
    const onlineusers = await onlineuserModel.find().populate('user'); 
    return onlineusers; 
  } catch (err) {
    console.error("onlineUsers repository Error:", err);
    throw new ErrorHandler("Something went wrong with the database", 500);
  }
}

// Gets all Users
async getAllUsers(){
  try{
    const users = await userModel.find().populate('user');
    return users;
  }catch(err){
    console.log("getAllUsers repository Error : ",err);
    throw new ErrorHandler("something went wrong with databse.",500);
  }
}


 // uploadProfilePicture 
  async uploadProfilePicture(userId, file) {
    if (!file) {
      throw new ErrorHandler('No file uploaded', 400);
    }
    //  file extension
    const fileExtension = path.extname(file.originalname);
    const key = `chatApp/profile-pictures/${userId}${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    try {
      await s3Client.send(command);
      const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

      await userModel.findByIdAndUpdate(
        userId,
        { profilepicture: fileUrl },
        { new: true }
      );
      return { message: 'Profile picture uploaded successfully' };
    } catch (err) {
      console.log('UploadProfilePicture repository Error : ', err);
      throw new ErrorHandler('something went wrong with database', 500);
    }
  }


    // removeProfilePicture
  async removeProfilePicture(userId) {
    try {
      const user = await userModel.findById(userId);

      if (!user) {
        throw new ErrorHandler('User not found', 404);
      }

      if (user.profilepicture) {
        let s3Key = user.profilepicture;
      if (user.profilepicture.startsWith('http')) {
        const s3Url = new URL(user.profilepicture);
        // remove leading '/'
        s3Key = s3Url.pathname.slice(1);
    
        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key:s3Key,
        };

        const command = new DeleteObjectCommand(params);
        await s3Client.send(command);

        await userModel.updateOne(
          { _id: userId },
          { $unset: { profilepicture: '' } }
        );
        return { message: 'Profile picture removed successfully' };
      }
      }
    } catch (err) {
      console.log('removeProfilePicture repository Error : ', err);
      throw new ErrorHandler('something went wrong with database', 500);
    }
  }


   //updateMode
  async updateMode(userId,mode){
try{
const user = await userModel.findByIdAndUpdate(userId,{
  displayMode:mode},
  {new:true});

  return user.displayMode;
}catch(err){
  console.log("updateMode repository Error : ",err);
  throw new ErrorHandler("something went wrong with database.",500);
}
  }



  //----------------!!!!!!!!!!!! USER SIGN OUT OPERATION
  async removeOnlineUser(userId){
    try{

     const result = await onlineuserModel.findOneAndDelete({ user: userId });
       if (!result) {
      throw new ErrorHandler("Online user not found.", 404);
    }
    return result;
    }catch(err){
      console.log("removeOnlineUser repository Error : ",err);
      throw new ErrorHandler("something went wrong with datbase.",500);
    }
  }

  async removeUserToken(userId){
    try{
     const result = await userModel.findByIdAndUpdate(userId, {$unset: { token: "" }});
     return result;
    }catch{
      console.log("removeUserToken repository Error : ",err);
      throw new ErrorHandler("something went wrong with databse.",500);
    }
  }
  //----------------!!!!!!!!!!!! USER SIGN OUT OPERATION !!!!!!!!!!!!!!!--------------------//

}