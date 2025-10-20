
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
const result = await this.messageRepository.postMessage(userId,messageText,timeStamp);
   res.status(200).json({
      userId: userId,
      message: result
    });
  }catch(err){
    console.log("postMessage controller Error : ",err);
    next(err);
  }
}

async deleteMessages(req,res,next){
  try{
const messageId = req.params.id;;
const result = await this.messageRepository.deleteMessage(messageId);
  res.status(200).json({ message: result, messageId: messageId});
  }catch(err){
    console.log("deleteMessage controller Error : ",err);
    next(err);
  }
}

}

