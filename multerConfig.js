const multer = require('multer')
const path = require('path')

const destination = (req, file, cb) => cb(null, path.resolve('./uploads/images'))

const filename = (req, file, cb) => cb(null, file.originalname.split(' ').join('-'))

const fileFilter = (req, file, cb) => {
  try {
    if (!req.body.title) {
      throw new Error("uploads must include job code");
    }

    if (req.body.code.trim().toLowerCase() !== '160over90') {
      throw new Error('The password you entered is incorrect')
    }

    if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype)) {
      throw new Error('File format must be png, jpg, or jpeg')
    }

    cb(null, true)
  } catch (err) {
    cb(err, false) // if validation failed, generate error
  }
}

const storage = multer.diskStorage({
  destination,
  filename,
})

module.exports = multer({ storage, fileFilter })
