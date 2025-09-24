// MIT License
// Copyright (c) 2025 Prawin-736
// See LICENSE file for more information

import express from "express";
import http from "http";
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { userRouter } from "./src/features/user/user-router.js";
import { messageRouter } from "./src/features/message/messenger-router.js";
import { Server } from "socket.io";
import { mongooseConnect } from "./mongodb.config.js";
import { checkS3Connection } from "./aws/checkS3Connection.js";
import UserRepository from './src/features/user/user-repository.js';
import { startExpiredUserChecker } from "./src/middleware/checkExpiredUsers.js";
import { config } from "./config.js";
 const userRepository = new UserRepository();

// setting this to get absoulte path
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.static(path.join(__dirname, '../client/src')));
// adding static path for devlopment mode
app.use('/project/koku-messenger', express.static(path.join(__dirname, '../client/src')));

//creating http server as socket.io need http server for initial handshake..
const server = http.createServer(app);

startExpiredUserChecker();
app.use('/api/user', userRouter);
app.use('/api/main', messageRouter);



//setting up socket server..
const io = new Server(server, { 
    cors:{
        origin:"*",
        methods:["GET","POST"]
    }
 });

  io.on("connection",(socket)=>{


     socket.on("join",(result)=>{
        socket.username = result.user.username;
        socket.userId = result.user._id;


        socket.emit("join",result);

        console.log(socket.username + " connected the chat");



        socket.on("disconnect", async () => {
   
            console.log(socket.username + " left the chat");

    });
});

     //------------------message section
         socket.on("AllMessages",(result)=>{
          io.emit("AllMessages",result);
         });

     socket.on("postMessage", (message) => {
    socket.broadcast.emit("postMessage", message);
  });

     //------------------message section------------------------//

  //---------------userDetail section after login

    socket.on("currentOnlineUsersEmit",(users)=>{
    socket.emit("currentOnlineUsers",users);
  });

    socket.on("allUserCountsIo",(result)=>{
    io.emit("allUserCountsIo",result);
  });

    socket.on("offlineUsersio",(result)=>{
    io.emit("offlineUsersio",result);
  });


  //---------------userDetail section after login----------------------//

  //--------------userDetail section after logout

    socket.on('updateConnectedUsers', () => {
        socket.broadcast.emit('updateConnectedUsers');
    });
  
  //--------------userDetail section after logout---------------------//

});

//errormiddleware
app.use((err, req, res, next) => {
  const statusCode = err.code || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    errors: [{ field: '', message }],
  });
});

// 404 error handling
app.use((req, res) => {
  res.status(404).json({
    error: 'API not found',
    code: 404,
  });
});

server.listen(config.port,()=>{
    console.log(`server is listening in local host ${config.port}..`);
    mongooseConnect();
    checkS3Connection();
});