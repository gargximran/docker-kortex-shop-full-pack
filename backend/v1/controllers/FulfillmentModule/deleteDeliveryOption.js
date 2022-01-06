const {
    DeliveryOption
  } = require("../../../db/models");
  const { Op } = require("sequelize");

  
  module.exports = async (req, res) => {
    const { shop: shopData } = req.user;
    const id = req.params.id;
    if(!shopData){
        return apiResponse.error(res, 400, 'Create a shop first!');
    }
  
    try {
      const exists = await DeliveryOption.findOne({
        where: {
          id,
          shopId: shopData.id
        }
      });
      if(!exists){
        return apiResponse.error(
          res,
          404,
          "Delivery option with the credentials not found!"
        );
      }
      await DeliveryOption.destroy({
          where: {
              id,
              shopId: shopData.id
          }
      })
      let object = {
        message: "Removed successfully",
      };
      return apiResponse.success(res, object);
    } catch (error) {
      console.log(error);
      return apiResponse.errorWithData(res, error, 400);
    }
  };
  