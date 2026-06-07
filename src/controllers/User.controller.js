import { asyncHandler } from "../utils/asynHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/Cloudnary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

//todo //for genreatinng tokens
const genrateAccessAndRefreshTokens = async(userId) => {
  try {
    const user = await User.findById(userId)

    const accessToken = user.genrateAccessToken()
    const refreshToken = user.genrateRefreshToken()
 
    user.refreshToken = refreshToken
    await user.save({validateBeforeSave:false})
   
    return {accessToken,refreshToken}

  } catch (error) {
    throw new ApiError(500,"Some thing went wrong while genreating  refresh and accces token")
  }
}


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
      const existedUser = await User.findOne({
    $or:[{ username },{ email }]             //! check karne ke liye ki username exist karta hai  sath hi email bhi to iisko is tarh se karte hai
   })
   if(existedUser){
    throw new ApiError(409,"User with email or username already exist")
   }

   // 4th step
   const avatarLocalPath = req.files?.avatar[0]?.path;
   // const coverimageLocalPath = req.files?.coverimage[0]?.path;

   let coverimageLocalPath;
   if(Request.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
    coverimageLocalPath = req.files.coverImage[0].
    path
   }
   if (!avatarLocalPath) {
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

//! accccess token , refresh token and cookies vedio

const loginUser  = asyncHandler(async(req,res) => {
    //1st req body se data le aoo
    //2nd username or email
    //3rd  find the user
    //4th find the user if valid or not
    //5th password check karo
    //6th access and refresh token genrate
    //7th send these tokens into cookies

  //*1st
    const {email,username,password} = req.body
    if (!username || !email) {
      throw new ApiError(400,"username or email is required")
      }
      //*2nd
     const user = await User.findOne({
      $or: [{username},{email}]
    })  
    //*3rd
    if(!user){
      throw new ApiError(404,"User does not exist")
    }
    //*4th
    const isPasswordValid = await user.ispasswordCorrect(password)
    if(!isPasswordValid){
      throw new ApiError(401,"Invalid user credentials")
    }
    

   const {accessToken,refreshToken} = await genrateAccessAndRefreshTokens(user._id)
   const loggedInUser = await User.findById(user._id)
   select("-password -refreshToken")

    const options = {  //? ye true karne par sirf server se modify ho sakti hhai cookies frontend se ya koi or nahi kar sakta 
      httpOnly :true,
      secure:true
  }

  return res
  .status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json(
    new ApiResponse(
      200,
      {
        user:loggedInUser,accessToken,refreshToken
      },
      "User Logged In Succsesfully"
    )
  )

})
//! for logout 
const logoutUser = asyncHandler(async(req,res)=>{
  await  User.findByIdAndUpdate(
      req.user._id,
      {
        $set:{
          refreshToken:undefined
        }
      },
      {
        new: true
      }
    )
    const options = {  //? ye true karne par sirf server se modify ho sakti hhai cookies frontend se ya koi or nahi kar sakta 
      httpOnly :true,
      secure:true
  }
  return res.status(200)
  .clearCookie("accessToken",option)
  .clearCookie("refreshToken",option)
  .json(new ApiResponse(200,{},"user logged Out Successfully"))
})
  
// 
const refreshAccessToken = asyncHandler(async(req,res)=>{
   const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

   if(!incomingRefreshToken){
 throw new ApiError(401,"unauthorized request")
   }

    try {
      const decodedToken =  jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
     )
  
  const user =await User.findById(decodedToken?._id)
      if(!user){
   throw new ApiError(401,"invalid refresh token")
     }
     if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401,"refresh token is expired or used")
     }
     const option = {
      httpOnly:true,
      secure:true
     }
    const {newrefreshToken,accessToken} =  await genrateAccessAndRefreshTokens(user._id)
  
  return res.status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json(
    new ApiResponse(
      200,
      {refreshToken:newrefreshToken,accessToken},
      "Access token refresh"
    )
  )
    } catch (error) {
      throw new ApiError(401,error?.message || "Invalid refresh token")
    }
})

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken
}