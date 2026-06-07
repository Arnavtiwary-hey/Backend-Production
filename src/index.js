//TODO puporse : MongoDB database connect karna aur uske baad Express server start karna.

//require('dotenv').config({path:'./env'})
import dotenv from "dotenv"; //!replace by this

// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";  // for connecting data base


dotenv.config({
    path:'./.env'
})


import connectDB from "./db/index.js";
console.log(process.env.MONGODB_URL)
connectDB()
.then(() =>{
    app.listen(process.env,PORT || 8000, () => {
        console.log(`SERVER IS RUNNING at port : ${process.env.PORT}`);
        app.on("error",(error) =>{
   console.log("ERR",error);
   throw error
   
        })
    })
})
.catch((error)=>{
console.log("MONGO DB connectTION FAILED !!",err);

})


//! jo jo comment m hia wo 1 st approch ke liye hai import wla









/*  //*first approch to connect the t data base
import express from "express";
const app = express()

( async () => {
    try {
      await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)

      app.on("error",(error) => {
        console.log("ERROR",error);
        throw error
        
      })

app.listen(process.env.PORT, ()=>{
    console.log(`App is listenning on poer ${process.env.PORT}`);
    
})

    }catch (error){
        console.log("ERROR",error);
        throw error
        
    }
})()


*/