const {
  Product,
  ProductImage,
  Category,
} = require("../../../db/models");
const { Op } = require("sequelize");
const db = require("../../../db/models");

module.exports = async (req, res) => {
  const productId = req.params.productId;
  const { shop: shopData } = req.user;
  if (!shopData) {
    return apiResponse.error(res, 400, "Create a shop first!");
  }

  try {
    const data = await Product.findAll({
      where: {
        shopId: shopData.id,
        parentId: {
          [Op.is]: null,
        },
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
    let object = {
      message: "Request processed successfully",
      products: data,
    };
    return apiResponse.success(res, object);
  } catch (error) {
    console.log(error);
    return apiResponse.errorWithData(res, error, 400);
  }
};
