
const cloudinary = require('cloudinary').v2
const fs = require('fs')

// Configuration

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const uploadCloudinary = async (localfilePath = 'public\\temp\\code.png') => {
    // Upload an image
    try {
        const uploadResult = await cloudinary.uploader
            .upload(
                localfilePath || 'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
            }
            )


        // delte a temp image fdile
        fs.unlinkSync(`${localfilePath}`, (err) => {
            if (err) {
                console.log('image unlinksyc error', err)
            }
        })

        return uploadResult
    } catch (error) {
        console.log("From Cloudinary upoloader function errro: ", error);

    }
}

// delte image from 
const deleteCloudinaryAssets = async (imagePath) => {
    try {
        cloudinary.v2.api
            .delete_resources(['tqmkggkjlicafnpcrcnh'],
                { type: 'upload', resource_type: 'image' })
    } catch (error) {
        console.log("From Cloudinary delete function error: ", error);
    }
}


module.exports = { uploadCloudinary }