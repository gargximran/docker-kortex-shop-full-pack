const {
    Availability,
  } = require("../../../db/models");
  const { Op } = require("sequelize");

  
  module.exports = async (req, res) => {
    const { shop: shopData } = req.user;
    if(!shopData){
        return apiResponse.error(res, 400, 'Create a shop first!');
    }
  
    try {
        const data = await Availability.findAll({
            where: {
              shopId: shopData.id,
              deletedAt: {
                [Op.is]: null,
              },
            }
          });
          if (!data) {
            return apiResponse.error(
              res,
              400,
              "Data not found!"
            );
          }
      let object = {
        message: "Request processed successfully",
        dates: data
      };
      return apiResponse.success(res, object);
    } catch (error) {
      console.log(error);
      return apiResponse.errorWithData(res, error, 400);
    }
  };
  