const { UserToken } = require("../../../db/models");

module.exports = async (req, res) => {
  const token = req.params.token;
  try {
    const data = await UserToken.findOne({
      where: {
        token,
      },
    });
    if (data === null) {
      return apiResponse.error(res, 404, "Token doesn't exist");
    }
    const isValid = new Date(data.expiredAt) > new Date();
    if (isValid) {
      let success = {
        status_code: 200,
        message: "Token is valid",
      };
      return apiResponse.success(res, success);
    } else {
      return apiResponse.error(res, 403, "Token is not valid!");
    }
  } catch (error) {
    console.log(error);
    return apiResponse.errorWithData(res, error, 400);
  }
};


x = {
  shopName: 'Unique|required',
  productName: 'Required|max|min',
  productImage: 'imageFile',
  hasVariant: 'Bool|Required',
  productPrice: 'requiredIfHasVariantFalse',
  variantImage : [
      'image', 'image'
  ],
  variantName: [
      'name', 'name'
  ],
  variantPrice: [
      'price', 'price'
  ],
  deliveryOption: ['delivery', 'pickup', 'both'],
  slug: 'String, unique',
  email: 'email',
  password: 'password'


}
