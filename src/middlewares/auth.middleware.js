// they verify user still have or not

import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asynHandler";
import jwt from "jsonwebtoken";
export const verifyJWT =  asyncHandler(async(req,_,next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","")
        if(!token){
            throw new ApiError(401,"unauthorized request")
        }
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
       const user =  await User.findById(decodedToken?._id).select("-password -refreshToken")
    
       if (!user) {
        //todo NEXT_VEDIO: discuss about frontend
         throw new ApiError(401,"Invalid Acess Token")
       }
       req.user = user;
       next()
    } catch (error) {
        throw new ApiError(401,error?.message || " Invalid access Token")
    }
})