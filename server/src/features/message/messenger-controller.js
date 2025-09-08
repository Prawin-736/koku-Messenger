
import MessageRepository from "./messenger-repository.js";


export default class MessageController {
  constructor() {
    this.messageRepository = new MessageRepository();
  }

  async getAllMessages(req,res,next){
    try{

      const userId = req.userId;
const messages = await this.messageRepository.getAllMessages();
res.status(200).json({messages,userId});

}catch(err){
      console.log("getAllMessages controller Error : ",err);
      next(err);
    }
  }

async postMessage(req,res,next){
  try{
const userId = req.userId;
const messageText = req.body.messageInput;
const timeStamp = req.body.timeStamp;
console.log("checking messageINput : ",messageText);
const result = await this.messageRepository.postMessage(userId,messageText,timeStamp);
res.status(200).json(result);
  }catch(err){
    console.log("postMessage controller Error : ",err);
    next(err);
  }
}

}