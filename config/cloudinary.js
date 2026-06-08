import { v2 as cloudinary } from 'cloudinary';
import express from "express";
import multer from "multer";

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
});

const opts = {
    overwrite:true,
    invalidate:true,
    resource_type:"auto"
}

// Upload an image
// const imageupload = (image) => {
//     return new Promise((resolve, reject)=> {
//         cloudinary.uploader.upload(image, opts, (error, result)=> {
//             if (result && result.secure_url) {
//                 console.log(result.secure_url)
//                 return resolve(result.secure_url)
//             }
//             console.log(error.message)
//             return reject({message:error.message})
//         })
//     })
// }




const imageupload = (image) => {
    const opts = {
        folder: "courses",
    };

    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(image, opts, (error, result) => {
            if (error) {
                console.error("Cloudinary Error:", error.message);
                return reject({ message: error.message });
            }

            if (result && result.secure_url) {
                return resolve(result.secure_url);
            }

            return reject({ message: "Upload failed" });
        });
    });
};



export default imageupload