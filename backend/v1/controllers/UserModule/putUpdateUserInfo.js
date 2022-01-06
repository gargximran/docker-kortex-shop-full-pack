const { User, UserToken } = require("../../../db/models");
const passwordHelper = require("../../helpers/services/passwordHelper");
const VerifyUserMail = require("../../helpers/mail/service/verify-user");
const hashMaker = require("../../helpers/hashMaker");

module.exports = async (req, res) => {
  const { email, oldPassword, newPassword, fullName } = req.body;

  try {
    // if (email) {
    //   const isEmailTaken = await User.findOne({ where: { email } });
    //   if (isEmailTaken) {
    //     return apiResponse.error(res, 400, "Email already taken!");
    //   }
    // }
    let hashedPassword = null;
    const { id: userId } = req.user;
    const userDb = await User.findOne({
      where: {
        id: userId,
      }
    });
    //console.log(userDb.dataValues)
    if (!userDb) {
      return apiResponse.error(res, 404, "User not found");
    }
    if (!!newPassword && !!oldPassword) {
      //Check password
      const isValidPassword = await passwordHelper.compare(
        oldPassword,
        userDb.dataValues.password
      );
      //console.log(isValidPassword);
      if (!isValidPassword) {
        return apiResponse.error(res, 400, "The old password is incorrect");
      }
      hashedPassword = await passwordHelper.hash(newPassword);
    }
    userDb.fullName = fullName || userDb.dataValues.fullName;
    //userDb.email = !!email ? email : userDb.dataValues.email;
    //userDb.isVerified = !!email ? false : userDb.dataValues.isVerified;
    userDb.password = hashedPassword || userDb.dataValues.password;
    userDb.updatedAt = new Date();
    await userDb.save();
    let success = {
      status_code: 200,
      message: "User info update successful.",
      data: {
        userDb: userDb.dataValues,
      },
    };

    //console.log(url);
    // if (!!email) {
    //   const client_url = process.env.CLIENT_URL || "http://localhost:3000";
    //   const token = await hashMaker(
    //     userDb.dataValues.email + userDb.dataValues.id
    //   );
    //   const url = `${client_url}/verify/?token=${token}`;
    //   await UserToken.create({
    //     userId: userDb.dataValues.id,
    //     token: token,
    //     createdAt: new Date(),
    //     expiredAt: new Date().setMinutes(new Date().getMinutes() + 30),
    //   });
    //   await VerifyUserMail(email, {
    //     firstName: userDb.dataValues.fullName,
    //     url,
    //   });
    // }
    return apiResponse.success(res, success);
  } catch (error) {
    console.log(error);
    return apiResponse.errorWithData(res, error, 400);
  }
};
