const {
    PickupOption,
    DeliveryOption
  } = require("../../../db/models");
  const { Op } = require("sequelize");

  
  module.exports = async (req, res) => {
    const { shop: shopData } = req.user;
    if(!shopData){
        return apiResponse.error(res, 400, 'Create a shop first!');
    }
  
    try {
        const pickupOptions = await PickupOption.findAll({
            where: {
              shopId: shopData.id,
              deletedAt: {
                [Op.is]: null,
              },
            }
          });
          const deliveryOptions = await DeliveryOption.findAll({
            where: {
              shopId: shopData.id,
              deletedAt: {
                [Op.is]: null,
              },
            }
          });
      let object = {
        message: "Request processed successfully",
        options: {
            pickupOptions,
            deliveryOptions
        }
      };
      return apiResponse.success(res, object);
    } catch (error) {
      console.log(error);
      return apiResponse.errorWithData(res, error, 400);
    }
  };
  