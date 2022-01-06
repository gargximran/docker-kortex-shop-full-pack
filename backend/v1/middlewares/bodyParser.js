const formidable = require('formidable');

module.exports = (req, res, next) => {
    const form = formidable({multiples: true});

    form.parse(req, (err, fields, files) => {
        if(!err){
            req.files = files;
            req.body = fields;
            next()
        }else{
            console.log(err)
            next(err)
        }

    })
}