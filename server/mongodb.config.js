import mongoose from 'mongoose';
import { config } from "./config.js"

const url = config.mongodb.dbUrl;
const dbName = config.mongodb.dbName;

export const mongooseConnect = async () => {
  try {
    await mongoose.connect(url, {
      //     useNewUrlParser:true,
      // userUnifiedTopology:true,
      dbName: dbName,
    });

    console.log('mongoose is connected to localHost 3000..');
  } catch (err) {
    console.log(err);
  }
};
