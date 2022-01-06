const { UserToken, User } = require("../../../db/models");
const Validator = require("validatorjs");
const passwordHelper = require("../../helpers/services/passwordHelper");
const { Op } = require("sequelize");
module.exports = async (req, res) => {
  const token = req.params.token;

  const rules = {
    password: "required|min:8",
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
    const data = await UserToken.findOne({
      where: {
        token,
      },
    });
    if (data === null) {
      return apiResponse.error(res, 404, "Token doesn't exist");
    }
    const isValid = new Date(data.expiredAt) > new Date();
    if (!isValid) {
      return apiResponse.error(res, 403, "Token is not valid!");
    }
    const password = await passwordHelper.hash(req.body.password);
    await User.update(
      { password, updatedAt: new Date() },
      {
        where: {
          id: data.userId,
          deletedAt: {
            [Op.is]: null,
          },
        },
      }
    );
    await UserToken.destroy({
      where: {
        id: data.id,
      },
    });
    let success = {
      status_code: 200,
      message: "Password Changed",
    };
    return apiResponse.success(res, success);
  } catch (error) {
    console.log(error);
    return apiResponse.errorWithData(res, error, 400);
  }
};
