const cloudinary = require('./connection')


const deleteImage = publicId => cloudinary.v2.uploader.destroy(publicId)

module.exports = deleteImage
