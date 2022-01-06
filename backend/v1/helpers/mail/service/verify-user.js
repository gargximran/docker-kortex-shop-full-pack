const mailer = require('..');
const WelcomeTemplate = require('../template/verify-account');

const VerifyUserMail = (to, user= { firstName: "user", url: "" }) => {

    const data = WelcomeTemplate(user);
    if(!to) return

    let mailDetail = {
        to: to,
        subject: "Welcome to kortex.Please verify your account.",
        html: `${data}`,
    };

    mailer.send(mailDetail);

}

module.exports = VerifyUserMail;