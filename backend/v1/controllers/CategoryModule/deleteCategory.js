const {
  Category,
  CategoryProduct,
} = require("../../../db/models");
const { Op } = require("sequelize");
const db = require("../../../db/models");
module.exports = async (req, res) => {
  const id = req.params.id;
  const { shop: shopData } = req.user;
  if (!shopData) {
    return apiResponse.error(res, 400, "Create a shop first!");
  }
  const transaction = await db.sequelize.transaction();
  try {
    const data = await Category.findOne({
      where: {
        id,
        shopId: shopData.id,
        deletedAt: {
          [Op.is]: null,
        },
      },
      include: ["products"],
    });
    if (!data) {
      return apiResponse.error(
        res,
        400,
        "Category with the credentials not found!"
      );
    }
    const categoryData = data.dataValues;
    await Category.destroy({
      where: {
        id: categoryData.id
      },
      transaction
    });
    await CategoryProduct.destroy({
      where: {
        categoryId: categoryData.id
      },
      transaction
    });
    
    //remove associated products
    // for(let i = 0; i < categoryData.products; i++){
    //   let productId = categoryData.products[i].dataValues.id;
    //   await Product.destroy({
    //     where: {
    //       id: productId
    //     }
    //   });
    //   await ProductImage.destroy({
    //     where: {
    //       productId
    //     }
    //   });
    // }
    let object = {
      message: "Removed category successfully!",
      data,
    };
    await transaction.commit();
    return apiResponse.success(res, object);
  } catch (error) {
    try{
      transaction.rollback();
    }catch(e){
      console.error(e);
    }
    console.log(error);
    return apiResponse.errorWithData(res, error, 400);
  }
};
