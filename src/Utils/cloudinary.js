const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
    cloud_name: "dtgniimdc",
    api_key: "246125213842436",
    api_secret: "0z8F8A_XFFFLxBlpL0HrD6JaewY",
    secure: true, // Ensures secure upload
});

cloudinary.api.ping()
    .then((result) => console.log("Cloudinary Connection Successful!", result))
    .catch((error) => console.error("Cloudinary Connection Failed!", error));

// cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/a9/Example.jpg",
//     { folder: "whitelight_categories" })
//     .then(result => console.log("Upload Success:", result))
//     .catch(error => console.error("Upload Error:", error));

module.exports = cloudinary;