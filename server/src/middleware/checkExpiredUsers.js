
import jwt from 'jsonwebtoken';
import UserRepository from '../features/user/user-repository.js';
import { userModel } from '../features/user/user-schema.js';

 const userRepository = new UserRepository();

function isTokenExpired(token) {
  try {
    const decoded = jwt.decode(token);
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
  } catch (err) {
    return true;
  }
}

async function checkAndLogoutExpiredUsers() {
  try {
const users = await userModel.find({ "token.token": { $ne: null } });

console.log("checkAndLogoutExpiredUsers is checking");

    for (const user of users) {
      if (isTokenExpired(user.token.token)) {
        console.log(`Logging out expired user: ${user.username}`);

        // Remove user from online list
        await userRepository.removeOnlineUser(user._id);

        // Remove token from user schema
        await userRepository.removeUserToken(user._id)

      }
    }
  } catch (err) {
    console.error('checkAndLogoutExpiredUsers Error : ', err);
  }
}

export function startExpiredUserChecker() {
  // Runs immediatly when server runs.
  checkAndLogoutExpiredUsers();

  //runs every 5 minutes
  setInterval(checkAndLogoutExpiredUsers, 3 * 60 * 1000);
}

