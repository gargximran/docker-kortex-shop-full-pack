const { DeliveryOption } = require("../../../db/models");
const { Op } = require("sequelize");

module.exports = async (req, res) => {
  const { title, price, description, currencyCode, serverResponse, cityName } = req.body;
  const { id: userId, shop: shopData } = req.user;
  try {
    if (!shopData) {
      return apiResponse.error(res, 404, "Shop doesn't exist!");
    }
    if (shopData.userId !== userId) {
      return apiResponse.error(res, 401, "Not authenticated!");
    }
    const deliveryOption = await DeliveryOption.create({
        title,
        price,
        shopId: shopData.id,
        currencyCode: currencyCode ? currencyCode : "AUD",
        description,
        serverResponse: serverResponse ? serverResponse : "Available",
        cityName: cityName || "Not Provided"
    })
    let object = {
      message: "Data inserted successfully",
      option: deliveryOption,
    };
    return apiResponse.success(res, object);
  } catch (error) {
    console.log(error);
    return apiResponse.error(res, 500, error);
  }
};
