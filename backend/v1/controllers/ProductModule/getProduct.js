const { Product, ProductImage, Category } = require("../../../db/models");
const { Op } = require("sequelize");
const db = require("../../../db/models");

module.exports = async (req, res) => {
  const productId = req.params.productId;
  const { shop: shopData } = req.user;
  if (!shopData) {
    return apiResponse.error(res, 400, "Create a shop first!");
  }

  try {
    const data = await Product.findOne({
      where: {
        id: productId,
        shopId: shopData.id,
        deletedAt: {
          [Op.is]: null,
        },
      },
      include: [
        {
          model: ProductImage,
          as: "product_images",
        },
        {
          model: Category,
          as: "categories",
        },
        {
          model: Product,
          as: "sub_products",
          include: [
            {
              model: ProductImage,
              as: "product_images",
            },
            {
              model: Category,
              as: "categories",
            },
          ],
        },
      ],
    });
    if (!data) {
      return apiResponse.error(
        res,
        400,
        "Product with the credentials not found!"
      );
    }
    let object = {
      message: "Request processed successfully",
      product: data,
    };
    return apiResponse.success(res, object);
  } catch (error) {
    console.log(error);
    return apiResponse.errorWithData(res, error, 400);
  }
};
