const { User, UserToken } = require("../../../db/models");
const Validator = require("validatorjs");
const ChangePasswordMail = require("../../helpers/mail/service/change-password");
const hashMaker = require("../../helpers/hashMaker");
const { Op } = require('sequelize');

module.exports = async (req, res) => {
  const rules = {
    email: "required|email",
  };
  const validation = new Validator(req.body, rules);
  if (validation.fails()) {
    return apiResponse.errorWithData(
      res,
      validation.errors.all(),
      422,
      "Validation Error"
    );
  }
  try {
    const data = await User.findOne({
        where: {
            email: req.body.email,
            deletedAt: {
                [Op.is] : null
            }
        }
    });
    if(data === null){
        return apiResponse.error(res, 400, "User with this email doesn't exist");
    }
    
    const token = await hashMaker(data.email + data.id);
    await UserToken.create({
      userId: data.id,
      token: token,
      createdAt: new Date(),
      expiredAt: new Date().setMinutes(new Date().getMinutes() + 30)
    })
    const client_url = process.env.RESET_PASSWORD_URL || "http://localhost:3000";
    // const url = `${client_url}?token=${token}`;
    const url = `${client_url}/?token=${token}`;
    console.log(url);
    await ChangePasswordMail(data.email, {firstName: data.fullName, url});
    let success = {
        status_code: 200,
        message: "Sent link...",
      };
    return apiResponse.success(res, success);
  } catch (error) {
    console.log(error);
    return apiResponse.errorWithData(res, error, 400);
  }
};
