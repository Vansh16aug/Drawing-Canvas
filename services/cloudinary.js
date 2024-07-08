require("dotenv").config();
const cloudinary = require('cloudinary').v2;
const fs=require('fs');

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async(localFilePath)=>{
    try {
        if(!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        console.log('file uploaded successfully!',response.url);
        return response.url;

    } catch (error) {
        fs.unlinkSync(localFilePath);
        return null;
    }
}

module.exports=cloudinary;