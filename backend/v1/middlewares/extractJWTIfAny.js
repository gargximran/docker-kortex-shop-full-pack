const { User, Shop } = require("../../db/models");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const decodeJWT = async (token) => {
  const privateKey = process.env.JWT_SECRETKEY;
  try {
    const decoded = await jwt.verify(token, privateKey);
    return {
      valid: true,
      decoded,
    };
  } catch (error) {
    console.log(error);
    return {
      valid: false,
      decoded: null,
    };
  }
};
const extractJWT = async (req, res, next) => {
  const headers = req?.headers["auth-token"]?.split(" ");
  let accessToken = undefined;
  if (headers?.length === 2) {
    accessToken = headers[1];
  }
  if (!accessToken) {
    return next();
  }
  let obj = {};
  try{
    obj = await decodeJWT(accessToken);
  }catch(err){
    obj = {};
    console.log(err)
  }
  const { decoded, valid } = obj;
  //console.log(valid);
  if (valid) {
    const response = await User.findOne({
      where: {
        id: decoded.id,
        deletedAt: {
          [Op.is]: null,
        },
      },
      include: "shop",
    });
    req.user = {...response.dataValues, shop: response.shop?.dataValues}
    //console.log(req.user)
    return next();
  }
  return next();
};
module.exports = {
  extractJWT,
};
