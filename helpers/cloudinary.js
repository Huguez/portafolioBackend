
const cloudinary = require("cloudinary").v2

const { CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET } = process.env

cloudinary.config({
   cloud_name: CLOUD_NAME,
   api_key: CLOUD_API_KEY, 
   api_secret: CLOUD_API_SECRET,
})

const { upload, destroy } = cloudinary.uploader
const { delete_folder, resources,  } = cloudinary.api

module.exports = {
   upload,
   destroy,
   delete_folder,
   resources
}