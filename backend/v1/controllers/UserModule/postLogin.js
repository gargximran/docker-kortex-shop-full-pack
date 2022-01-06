const { User, Shop } = require("../../../db/models");

const passwordHelper = require("../../helpers/services/passwordHelper");
const { generateJWT } = require('../../helpers/auth/generateJWT');

module.exports = async (req, res) => {


  try {
    //Check if user exists
    const userDb = await User.findOne({ where: { email: req.body.email } });
    if (!userDb) {
      return apiResponse.error(res, 404, "User not found with specific id.");
    }

    //Check password
    const isValidPassword = await passwordHelper.compare(
      req.body.password,
      userDb.password
    );
    //console.log(isValidPassword);
    if (!isValidPassword) {
      return apiResponse.error(res, 400, "The email or password are incorrect");
    }

    //Generate JWT
    let {password, email, ...tokenParams} = userDb.dataValues;
    const shopData = await Shop.findOne({where: {
      userId: userDb.id
    }});
    const token = await generateJWT({...tokenParams, shopSlug: shopData.dataValues.slug});

    let object = {
      userDb: tokenParams,
      token,
    };
    return apiResponse.success(res, object);
  } catch (error) {
    console.log(error);
    return apiResponse.error(res, 500, error);
  }
};
