const express = require('express');
const router = express.Router();
const {upload} = require('../middleware/multer.middleware.js')
const {fileConverter} = require('../controllers/converter.controller.js')
router.route('/').post(upload.single('file'),fileConverter)

module.exports=router;