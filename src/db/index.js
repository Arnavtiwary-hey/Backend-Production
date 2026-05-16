import mongoose from "mongoose";
import { DB_NAME } from "../constants.js"; // humne databse ka nam de diya and create karnege jab conncect hoga mongodb

const connectDB = async () => { 
    try {
      const connectioninstance =  await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
      console.log(`\n MongoDB  connected !! DB HOST : ${connectioninstance.connection.host}`);
      
    } catch (error) {
        console.log("MONGODB connection error",error);
        process.exit(1)
    }
}

export default connectDB 
//! AB YE JITNA HAI USKO HUM EXPORT KARNEGE KAHA INDEX.JS ME 
//* kyo ki ye dura approch hai phla approch hai 
//? 1st approch index,js me hai