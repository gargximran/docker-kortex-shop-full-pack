const {
  CategoryProduct,
  Product,
  ProductImage,
  Category,
} = require("../../../db/models");
const { Op } = require("sequelize");
const db = require("../../../db/models");

module.exports = async (req, res) => {
  const productId = req.params.productId;
  const { shop: shopData } = req.user;
  try {
    const data = await Product.findOne({
      where: {
        id: productId,
        shopId: shopData.id,
        deletedAt: {
          [Op.is]: null,
        },
      },
      include: ["sub_products", "categories"]
    });
    if (!data) {
      return apiResponse.error(
        res,
        400,
        "Product with the credentials not found!"
      );
    }
    //delete parent product
    await Product.destroy({
      where: {
        id: productId,
        shopId: shopData.id,
      }
    });
    await Product.destroy({
      where: {
        parentId: productId,
        shopId: shopData.id
      }
    });
    const child = data.dataValues.sub_products;
  
    //remove child products
    for(let i = 0; i < child.length; i++){
      //remove product images
      //console.log("******************Prod" ,child[i].dataValues.id)
      await ProductImage.destroy({
        where: {
          productId: child[i].dataValues.id
        }
      });
      //remove from category-products
      await CategoryProduct.destroy({
        where: {
          productId: child[i].dataValues.id
        }
      });

    }
    let object = {
      message: "Removed successfully",
    };
    return apiResponse.success(res, object);
  } catch (error) {
    console.log(error);
    return apiResponse.errorWithData(res, error, 400);
  }
};
