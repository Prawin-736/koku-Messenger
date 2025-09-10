
import { config } from '../../config.js';
import jwt from 'jsonwebtoken';
import UserRepository from '../features/user/user-repository.js';

 const userRepository = new UserRepository();


export const jwtAuth = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.redirect('/api/user/signIn');
  }

  try {
    const payload = jwt.verify(token, config.jwt.secretKey);
    req.userId = payload.userId;
    req.username = payload.username;

        const userToken = await userRepository.fetchUserToken(req.userId);
    if (userToken === token) {
      return next();
    } else {
      //clearning the cookie as it doesnt match with token stored in the userSchema
      res.clearCookie('jwt');
      return res.redirect('/api/user/signIn');
    }

   
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    return res.redirect('/api/user/signIn');
  }
};

