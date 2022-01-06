const mime = require('mime');

var imageValidation = {
    base64: (data) => {
        var image = data.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
        if(image == null){
            return false;
        }

        if(image.length != 3){
            return false;
        }
        let extension = mime.extension(image[1]);

        if(extension == 'jpg' || extension == 'png' || extension == 'jpeg' || extension == 'webp') {
            return true;
        } else {
            return false;
        }
    }
}

module.exports = imageValidation;
