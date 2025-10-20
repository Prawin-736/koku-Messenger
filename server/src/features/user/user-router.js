import express from "express";
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import multer from 'multer';
import UserController from "./user-controller.js";
import { jwtAuth } from "../../middleware/jwt.js";
import { signInvalidation } from "../../middleware/user-validation.js";


// setting this to get absoulte path
const __dirname = dirname(fileURLToPath(import.meta.url));

export const userRouter = express.Router();
const userController = new UserController();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const isProduction = process.env.NODE_ENV === 'production';

userRouter.get('/signIn', (req, res) => {
 const fileName = isProduction ? 'user.prod.html' : 'user.dev.html';

  res.sendFile(path.join(__dirname, '../../../../client/src/user', fileName));
});

userRouter.post('/signIn',signInvalidation, (req, res,next) => {userController.signInUser(req,res,next)});

//fetches user detail.after user logins
userRouter.get('/userDetail',jwtAuth,(req,res,next)=>{userController.getUserDetail(req,res,next)})


//------------user profile picture section

// upload profile picture
userRouter.post(
  '/profilepicture',
  jwtAuth,
  upload.single('profileImage'),
  (req, res, next) => {
    userController.uploadProfilePicture(req, res, next);
  }
);

// remove Profile picture
userRouter.post('/removeprofilepicture', jwtAuth, (req, res, next) => {
  userController.removeProfilePicture(req, res, next);
});

//------------user profile picture section

//disploy mode
userRouter.post('/displayMode',jwtAuth,(req,res,next)=>{
  userController.updateDisplayMode(req,res,next);
});

//logout user
userRouter.post('/logout',jwtAuth, (req, res,next) => {
  userController.logOutUser(req,res,next);
});