const Validator = require("validatorjs");

module.exports = (req, res, next) => {
  let rules = {
    email: "required|email",
    password: "required|min:8",
    shopName: "required|string|min:3|max:25",
    fullName: "string|min:3|max:25",
    deliveryOption: "required|string",
    shopSlug: "required|string|min:3|max:100",
    productName: "required|string|min:4|max:15",
    hasVariant: "required|string",
    shopAddress: "required|string",
    deliveryCityName: "string",
    deliveryFee: "string|min:1|max:100",
    deliveryDescription: "string",
    pickupCityName: "string",
    pickupFee: "string|min:1|max:100",
    pickupDescription: "string",
    productImage: "string",
    shopImage: "string",
    variantImage: "array",
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
    const possibleDeliveryOptions = ["delivery", "pickup", "both"];
    if (!possibleDeliveryOptions.includes(req.body.deliveryOption)) {
      return apiResponse.error(res, 400, "Delivery option is not valid!");
    }
    const {
      deliveryFee,
      deliveryCityName,
      deliveryDescription,
      pickupFee,
      pickupCityName,
      pickupDescription,
      deliveryOption,
    } = req.body;
    if (deliveryOption === "delivery") {
      if (!deliveryFee || !deliveryCityName || !deliveryDescription) {
        return apiResponse.error(
          res,
          400,
          "delivery-address, delivery-city-name and delivery-descriptions are required!"
        );
      }
    } else if (deliveryOption === "pickup") {
      if (!pickupFee || !pickupCityName || !pickupDescription) {
        return apiResponse.error(
          res,
          400,
          "pickup-address ,pickup-city-name and pickup-descriptions are required!"
        );
      }
    } else {
      if (!deliveryFee || !deliveryCityName || !deliveryDescription) {
        return apiResponse.error(
          res,
          400,
          "delivery-address, delivery-city-name and delivery-descriptions are required!"
        );
      }
      if (!pickupFee || !pickupCityName || !pickupDescription) {
        return apiResponse.error(
          res,
          400,
          "pickup-address ,pickup-city-name and pickup-descriptions are required!"
        );
      }
    }
    let hasVariant = !!JSON.parse(req.body.hasVariant);
    req.body.hasVariant = hasVariant;
    //if it doesn't have variant then it must include the product price
    if (hasVariant) {
      //product price shouldn't be null
      req.body.productPrice = null;

      let variantImageExists = "variantImage" in req.files;
      if (!variantImageExists) {
        req.files.variantImage = [];
      }
      let variantNameExists = "variantName" in req.body;
      if (!variantNameExists) {
        return apiResponse.error(
          res,
          400,
          "Must have the variantName property!"
        );
      }
      let variantPriceExists = "variantPrice" in req.body;
      if (!variantPriceExists) {
        return apiResponse.error(
          res,
          400,
          "Must have the variantPrice property!"
        );
      }
      //check if variant image in singular form or not..if it is make it an array;
      if (!Array.isArray(req.files.variantImage)) {
        req.files.variantImage = [req.files.variantImage];
      }
      //check if variant price and variant Name is array or not
      console.log(req.body.variantName);
      let variantNameArr =
        typeof req.body.variantName === "string"
          ? [req.body.variantName]
          : req.body.variantName;
      if (!Array.isArray(variantNameArr)) {
        return apiResponse.error(
          res,
          400,
          "format of the variantName is not correct!"
        );
      }
      variantNameArr.forEach((el) => {
        if (typeof el !== "string") {
          return apiResponse.error(
            res,
            400,
            `format of the value: ${el} inside  variantName array is not correct!`
          );
        }
      });
      let variantPriceArr =
        typeof req.body.variantPrice === "string"
          ? [req.body.variantPrice]
          : req.body.variantPrice;
      if (!Array.isArray(variantPriceArr)) {
        return apiResponse.error(
          res,
          400,
          "format of the variantPrice is not correct!"
        );
      }
      variantPriceArr.forEach((el) => {
        if (typeof el !== "string") {
          return apiResponse.error(
            res,
            400,
            `format of the value: ${el} inside  variantPrice array is not correct!`
          );
        }
      });
      //check if the length of three of the arrays are same;
      let areLengthsValid = variantNameArr.length === variantPriceArr.length;
      if (!areLengthsValid) {
        return apiResponse.error(
          res,
          400,
          "Length of the variantName and variantPrice array are not same!"
        );
      }
      req.body.variantPrice = variantPriceArr;
      req.body.variantName = variantNameArr;
      if (!"variantImage" in req.body) {
        req.body.variantImage = [];
      }
    } else {
      let productPrice = req.body.productPrice;
      if (!productPrice) {
        return apiResponse.error(
          res,
          400,
          "Must include the price of the product!"
        );
      }
    }
  }
  return next();
};
