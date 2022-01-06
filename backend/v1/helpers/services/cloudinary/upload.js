const cloudinary = require('./connection')
const datauri = require('datauri')


/**
 *
 * @param file File
 * @param folder String
 *
 * @return {public_id, ...}
 *
 * */
 module.exports = (file, folder) => {
    return new Promise((resolve, reject) => {
        datauri(file.path).then(bs => {
            cloudinary.v2.uploader.upload(bs, {folder: folder}, (err, result) => {
                if(err){
                    reject(err)
                }
                resolve(result)
            })
        }).catch(err => {
            reject(err)
        })
    })
}
