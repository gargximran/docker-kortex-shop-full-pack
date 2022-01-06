const {
    Category,
  } = require("../../../db/models");
  const { Op } = require("sequelize");

  
  module.exports = async (req, res) => {
    const { shop: shopData } = req.user;
    if(!shopData){
        return apiResponse.error(res, 400, 'Create a shop first!');
    }
  
    try {
        const data = await Category.findAll({
            where: {
              shopId: shopData.id,
              deletedAt: {
                [Op.is]: null,
              },
            },
            include: ["products"]
          });
          if (!data) {
            return apiResponse.error(
              res,
              400,
              "Data not found!"
            );
          }
      return apiResponse.success(res, data);
    } catch (error) {
      console.log(error);
      return apiResponse.errorWithData(res, error, 400);
    }
  };
  