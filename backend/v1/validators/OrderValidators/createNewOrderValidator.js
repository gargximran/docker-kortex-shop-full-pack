const Validator = require("validatorjs");

module.exports = (req, res, next) => {
  let rules = {
    customerName: "required",
    customerEmail: "required|email",
    isGift: "required",
    fulfillmentType: "required",
    fulfillmentDate: "required|date",
    cart: "required",
    giftReceiverEmail: "email",
  };

  const validator = new Validator(req.body, rules);

  if (validator.fails()) {
    return apiResponse.errorWithData(
      res,
      validator.errors.all(),
      422,
      "Validation Error"
    );
  } else {
    //extract delivery option and check if it is valid
    const possibleDeliveryOptions = ["delivery", "pickup"];
    if (!possibleDeliveryOptions.includes(req.body.fulfillmentType)) {
      return apiResponse.error(
        res,
        400,
        'Fulfillment type is not valid(Must be either "delivery" or "pickup"!'
      );
    }
    const {
      fulfillmentType,
      deliveryOptionId,
      pickupOptionId,
      deliveryAddress,
      giftReceiverEmail,
      cart,
      isGift,
    } = req.body;
    if (!Array.isArray(cart)) {
      return apiResponse.error(res, 400, "Cart type must be an array!");
    } else {
      for (let i = 0; i < cart.length; i++) {
        let objToMan = cart[i];
        if (!objToMan.productId || !objToMan.qty) {
          return apiResponse.error(
            res,
            400,
            "format of the cart products is not valid!"
          );
        }
      }
    }
    if (isGift) {
      if (!giftReceiverEmail) {
        return apiResponse.error(
          res,
          400,
          "Gift receiber's email is required!"
        );
      }
    }
    if (fulfillmentType === "delivery") {
      if (!deliveryOptionId || !deliveryAddress) {
        return apiResponse.error(
          res,
          400,
          "delivery-address and delivery-option-id are required!"
        );
      }
    } else {
      if (!pickupOptionId) {
        return apiResponse.error(res, 400, "pickup-option-id is required!");
      }
    }
  }
  return next();
};
