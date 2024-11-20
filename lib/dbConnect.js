import mongoose from "mongoose";
const connectionDB = {isConnected :  0} ;
export const connectDB = async () => {

    if(connectionDB.isConnected == 1 ){
        console.log("Already Connected to DB");
        return
    }
  try {
    const { connection } = await mongoose.connect(process.env.MONGODB_URI || '');
    if (connection.readyState === 1) {
        connectionDB.isConnected = 1 ;
      return Promise.resolve(true);
    }
  } catch (error) {
      console.error(error);
      process.exit() ;
  }
};