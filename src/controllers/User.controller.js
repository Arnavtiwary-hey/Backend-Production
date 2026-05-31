import { asyncHandler } from "../utils/asynHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/Cloudnary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler( async (req,res) => {

 //! ye pura flow hai registration for user
  //? get user detaails from frontend
  //? vlaidation - if user dpnt left any left spce
  //? check if user already exists : username,email
  //? check for images, checck for avtar
  //?uload them to cloudinnary,check avatar
  //? create user object  - create entry in db
  //? remove password and refresh token field from rsponse
  //?  check for user creation
  //? if created then return response

   //*start makinng 
  
  //1st
   const {username,email,fullname,password} = req.body
   console.log("email:",email);
   
   //2nd
   if(fullname === ""){
    throw new ApiError(400,"fullname is required")
   }

   if (
    [fullname,email,username,password].some((field)=> 
      field?.trim() === "")
   ) {
     throw new ApiError(400,"All fields are required")
   }

   // 3 step
      const existedUser = User.findOne({
    $or:[{ username },{ email }]             //! check karne ke liye ki username exist karta hai  sath hi email bhi to iisko is tarh se karte hai
   })
   if(existedUser){
    throw new ApiError(409,"User with email or username already exist")
   }

   // 4th step
   const avvatarLocalPath = req.files?.avatar[0]?.path;
   const coverimageLocalPath = req.files?.coverimage[0]?.path;
   if (!avvatarLocalPath) {
     throw new ApiError(400,"Avatar file is required")
   }
  //5th step
   const avatar  = await uploadOnCloudinary(avvatarLocalPath)
   const coverImage =await uploadOnCloudinary(coverimageLocalPath)
   if(!avatar){
     throw new ApiError(400,"Avatar file is required")
   }
   //6th
  const user = await User.create({
  fullname,
  avatar:avatar.url,
  coverImage:coverImage?.url || "",
  email,
  password,
  username:username.toLowerCase()
 })
 const createdUser  = await User.findById(user._id).select(
  "-password -refreshToken"    // 7th step
 )
 if(!createdUser){
  throw new ApiError(500,"something went wrong while registrening the user")
 }
   
// 8thstep
return res.status(201).json(
  new ApiResponse(200,createdUser,"user registerd succesfuly")
)

})



export {registerUser}