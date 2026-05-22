import { json } from "express"


//*Async functions me errors ko automatically handle karna.Taaki baar-baar try-catch na likhna pade.
const asyncHandler = (requestHandler) => {
  return  (req,res,next) => {
        Promise.resolve(requestHandler(req,res,next)).catch((err) => next(err))
    }
}



export {asyncHandler}


//const asyncHandler = () => {}     //! ye sab dikha raha hai ki hum kaise  fun ke andar fun rakhte hai
// const asyncHandler = (func) => {() => {}}
// const asyncHandler = (func) => aync () => {}

// const asyncHandler = (fn) =>(req,re,next) => {
//     try {
//         await fn(req,res,next)
//     } catch (error) {
//         res.status(err.code || 500,json).json({
//             success : false,
//             message:err.message
//         })
//     }
// }