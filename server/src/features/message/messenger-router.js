import express from "express";
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { jwtAuth } from "../../middleware/jwt.js";
import MessageController from "./messenger-controller.js";

// setting this to get absoulte path
const __dirname = dirname(fileURLToPath(import.meta.url));

export const messageRouter = express.Router();
const messageController = new MessageController();

messageRouter.get('/', jwtAuth,(req, res,next) => {
  res.sendFile(path.join(__dirname, '../../../../client/src/main/index.dev.html'));
});

//Post Message
messageRouter.post('/message',jwtAuth,(req,res,next)=>{
  messageController.postMessage(req,res,next);
})

//get all Message
messageRouter.get('/allmessage',jwtAuth,(req,res,next)=>{
  messageController.getAllMessages(req,res,next);
})

//delete specifc message.
messageRouter.delete('/message/:id', jwtAuth, (req, res, next) => {
  messageController.deleteMessages(req, res, next);
});