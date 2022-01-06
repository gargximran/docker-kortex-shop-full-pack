const {
    PickupOption,
  } = require("../../../db/models");
  const { Op } = require("sequelize");

  
  module.exports = async (req, res) => {
    const { shop: shopData } = req.user;
    const id = req.params.id;
    if(!shopData){
        return apiResponse.error(res, 400, 'Create a shop first!');
    }
  
    try {
      const exists = await PickupOption.findOne({
        where: {
          id,
          shopId: shopData.id
        }
      });
      if(!exists){
        return apiResponse.error(
          res,
          404,
          "Pickup option with the credentials not found!"
        );
      }
      await PickupOption.destroy({
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
  