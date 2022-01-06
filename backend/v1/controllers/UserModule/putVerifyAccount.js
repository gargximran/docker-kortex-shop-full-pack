const { UserToken, User } = require("../../../db/models");
const { Op } = require('sequelize');
module.exports = async (req, res) => {
  const token = req.params.token;

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
    await User.update({isVerified: true, updatedAt: new Date()},{
        where: {
            id: data.userId,
            deletedAt: {
                [Op.is] : null
            }
        }
    });
    await data.destroy();
    let success = {
        status_code: 200,
        message: "Account verified",
      };
      return apiResponse.success(res, success);
  } catch (error) {
    return apiResponse.errorWithData(res, error, 400);
  }
};
