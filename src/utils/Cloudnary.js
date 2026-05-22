import { v2 as cloudinary} from "cloudinary";
import  fs  from "fs";


  // Configuration
    cloudinary.config({ 
        cloud_name: process.env.ClOUDINARY_CLOUD_NAME, 
        api_key: process.env.ClOUDINARY_API_KEY, 
        api_secret: process.env.ClOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });

    const uploadOnCloudinary = async(localFilePath) =>{
        try {
            if(!localFilePath) return null
            // uload the file on cloudinary
           const response = await cloudinary.uploader.upload(localFilePath,{
                resource_type:"auto"
            })
            //? file has been uploaded succesfully
            console.log("file is uloaded in clodinary",response.url);
            return response
        } catch (error) {
           fs.unlinkSync(localFilePath)  // removw the locally saved temporaliyy file as the upoad opertaion got failed 
           return null
        }
    }
export {uploadOnCloudinary}
     
    
    
    