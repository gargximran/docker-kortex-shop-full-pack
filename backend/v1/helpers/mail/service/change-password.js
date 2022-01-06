const mailer = require('..');
const ChangePasswordTemplate = require('../template/change-password');

const ChangePassword = (to, user= { firstName: "user", url: "" }) => {

    const data = ChangePasswordTemplate(user);
    if(!to) return

    let mailDetail = {
        to: to,
        subject: "Change your password",
        html: `${data}`,
    };

    mailer.send(mailDetail);

}

module.exports = ChangePassword;