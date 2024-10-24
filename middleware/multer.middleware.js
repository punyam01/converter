const multer= require("multer")
const path = require("path");


  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/temp')); // Use path.join for safer path handling
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
  
const upload = multer({ storage: storage });
module.exports = { upload };