const nodemailer = require('nodemailer')

module.exports.send = (mailDetail) => {

    let transporter = nodemailer.createTransport({
        // service: 'gmail',
        // auth: {
        //     user: 'dev@algosolver.com',
        //     pass: 'password'
        // }
        host: process.env.MAIL_HOST || "smtp.mailtrap.io",
        port: process.env.MAIL_PORT || 2525,
        auth: {
          user: process.env.MAIL_USER || "0dc93e44af4daa",
          pass: process.env.MAIL_PASSWORD || "0d3c0c6adf3876"
        }
    })

    let senderName = process.env.MAIL_SENDER || "Kortex"
    let senderMail = process.env.MAIL_ADDRESS || "info@algosolver.com"

    let detail = {
        ...mailDetail,
        from: `"${senderName}" <${senderMail}>`,
    }

    transporter.sendMail(detail, function (error, info) {
        if(error) { 
            console.log(error); 
        }
        else { 
            console.log(info);
        }
    })

}