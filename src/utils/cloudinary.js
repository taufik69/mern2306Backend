
const cloudinary = require('cloudinary').v2
const { log } = require('console');
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
        let SecureLink =[]
        for(let imagePath of localfilePath){
            const uploadResult = await cloudinary.uploader
            .upload(
                imagePath?.path || 'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
            }
            )
        // delte a temp image fdile
        fs.unlinkSync(`${imagePath?.path}`, (err) => {
            if (err) {
                console.log('image unlinksyc error', err)
            }
        })
        SecureLink.push(uploadResult?.secure_url);
        }
      return SecureLink
   
       
    } catch (error) {
        console.log("From Cloudinary upoloader function errro: ", error);

    }
}

// delte image from 
const deleteCloudinaryAssets = async (imagePath) => {
    try {
      let deltedItem = []
        for(let coludinaryName of imagePath){
            const allArr =(coludinaryName.split('/'));
            const cloudImagename =(allArr[allArr?.length -1].split('.')[0]);
            const deleteItem = await cloudinary.api
            .delete_resources(cloudImagename ||'dpkks1jq07ehurbjhm6u',
                { type: 'upload', resource_type: 'image' })
              
                deltedItem.push(deleteItem)
        }
        return deltedItem
        
        
    } catch (error) {
        console.log("From Cloudinary delete function error: ", error);
    }
}


module.exports = { uploadCloudinary ,deleteCloudinaryAssets}