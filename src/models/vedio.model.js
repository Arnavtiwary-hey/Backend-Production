import mongoose, { Schema } from "mongoose";

import mongooseAggregatepaginate from "mongoose-paginate-v2"

const vedioSchema = new Schema(
    {
      vedioFile:{
        type:String, //! cloudnary url
        required:true
      },
      thumbnail:{
         type:String, //! cloudnary url
        required:true
      } ,
      title:{
         type:String, 
        required:true
      },
      description:{
         type:String, 
        required:true
      },
      duartion:{
         type:Number, //! cloudnary url
        required:true
      },
      views:{
        type:Number,
        default:0
      },
      isPublished:{
        type:Boolean,
        default:true
      },
      vedioOwner:{
        type:Schema.Types.ObjectId,
        ref:"User"
      }
    },
    {timestamps:true}
)

vedioSchema.plugin(mongooseAggregatepaginate)

 export const Vedio = mongoose.model("Vedio",vedioSchema)