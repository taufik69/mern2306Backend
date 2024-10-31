
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
        console.log(uploadResult);

        // delte a temp image fdile
        fs.unlinkSync(`${localfilePath}`, (err) => {
            if (err) {
                console.log('image unlinksyc error', err)
            }
        })
    } catch (error) {
        console.log("From Cloudinary upoloader function errro: ", error);

    }
}

module.exports = { uploadCloudinary }