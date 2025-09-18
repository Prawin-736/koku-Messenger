
import jwt from "jsonwebtoken";
import UserRepository from "./user-repository.js";
import { config } from "../../../config.js";


export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }


async signInUser(req, res, next) {
  // Use arrow function to preserve `this`
  const createToken = async (userId, username) => {
    const token = jwt.sign(
      {
        userId: userId,
        username: username,
      },
      config.jwt.secretKey,
      { expiresIn: '30m' }
    );

    // add token to database
    const time = new Date();
    const addToken = await this.userRepository.addToken(userId, token, time);

    if (addToken) {
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: false, // only over HTTPS in production
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000, // 1 hour
      });
    }
  };

  try {
    const username = req.body.username;
    // checking first time login
    const user = await this.userRepository.checkUserExsist(username);
    if (!user) {
      const addUser = await this.userRepository.addUser(username);
      if (addUser) {
        await this.userRepository.addOnlineUser(addUser._id);
        await createToken(addUser._id, addUser.username);
        return res.status(200).json("✅ Login successful");
      }
    } else {
      await this.userRepository.addOnlineUser(user._id);
      await createToken(user._id, user.username);
      res.status(200).json("✅ Login successful ");
    }
  } catch (err) {
    console.log("findUser controller Error : ", err);
    next(err);
  }
}
  
 async getUserDetail(req,res,next){
try{
const userId = req.userId;
const user = await this.userRepository.getUser(userId);
const checkUserIsInOnlineList = await this.userRepository.checkUserOnlineList(userId);
const currentOnlineUsersEmit = await this.userRepository.currentOnlineUsersEmit(userId);
const currentOnlineBroadcast = await this.userRepository.currentOnlineUser(userId);
const allUserCounts = await this.userRepository.allUserCounts();
const offlineUsersio = await this.userRepository.OfflineUserIo();
if(currentOnlineUsersEmit && allUserCounts && offlineUsersio){
  res.status(200).json({user,checkUserIsInOnlineList,currentOnlineUsersEmit,currentOnlineBroadcast,allUserCounts,offlineUsersio});
}
}catch(err){
  console.log("getUserDetail controller Error : ",err);
  next(err);
}
  }

    // upload profile picture 
  async uploadProfilePicture(req, res, next) {
    try {
      const file = req.file;
      const userId = req.userId;

      const result = await this.userRepository.uploadProfilePicture(
        userId,
        file
      );
      res.status(200).json({ message: result.message });
    } catch (err) {
      console.log('uploadProfilePicture controller Error : ', err);
      next(err);
    }
  }

    // removeProfilePicture 
  async removeProfilePicture(req, res, next) {
    try {
      const userId = req.userId;
      const result = await this.userRepository.removeProfilePicture(userId);
            res.status(200).json({ message: result.message });
    } catch (err) {
      console.log('removeProfilePicture controller Error : ', err);
      next(err);
    }
  }

  //updateDisplayMode
  async updateDisplayMode(req,res,next){
    try{

      const userId = req.userId;
      const {mode} = req.body;

      const updateMode = await this.userRepository.updateMode(userId,mode);
      if(updateMode){
        res.status(200).json(updateMode);
      }
    }catch(err){
      console.log("updateDisplayMode controller Error : ",err);
      next(err);
    }
  }

    //logout user 
  async logOutUser(req,res,next){
    try{
      const userId = req.userId;
      //operation to remove current users from online users
      const removeOnlineUser = await this.userRepository.removeOnlineUser(userId);
      //operation to remove current user token
      const removeUserToken = await this.userRepository.removeUserToken(userId);
      if(removeOnlineUser && removeUserToken){
        res.clearCookie('jwt');
      res.status(200).json({removeOnlineUser,removeUserToken});
      }
    }catch(err){
      console.log("logOUtUser controller Error : ",err);
      next(err);
    }
  }


}