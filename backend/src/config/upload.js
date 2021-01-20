const { request } = require('express')
const multer = require('multer')
const path = require('path')

module.exports = {
  storage: multer.diskStorage({
    destination: path.join(__dirname,'..','..','uploads'),
    filename: (request, file, cb) => {
      let filename = `${Date.now()}-${file.originalname}`
      filename = filename.replace(/\s/g, '');
      cb(null, filename)
    }
  })
}