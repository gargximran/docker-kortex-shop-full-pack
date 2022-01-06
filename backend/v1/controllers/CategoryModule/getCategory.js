const {
    Category,
  } = require("../../../db/models");
  const { Op } = require("sequelize");
  const db = require("../../../db/models");
  
  module.exports = async (req, res) => {
    const id = req.params.id;
    const { shop: shopData } = req.user;
    if(!shopData){
        return apiResponse.error(res, 400, 'Create a shop first!');
    }
  
    try {
        const data = await Category.findOne({
            where: {
              id,
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
              "Category with the credentials not found!"
            );
          }
      return apiResponse.success(res, data);
    } catch (error) {
      console.log(error);
      return apiResponse.errorWithData(res, error, 400);
    }
  };
  