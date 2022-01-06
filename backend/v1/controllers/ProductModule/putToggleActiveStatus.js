const { Product, ProductImage, Category } = require("../../../db/models");
const { Op } = require("sequelize");
const db = require("../../../db/models");
module.exports = async (req, res) => {
  const productId = req.params.productId;
  const { shop: shopData } = req.user;
  const transaction = await db.sequelize.transaction();
  try {
    const data = await Product.findOne({
      where: {
        id: productId,
        shopId: shopData.id,
        deletedAt: {
          [Op.is]: null,
        },
      },
      //include: ["product_images"],
    });
    if (!data) {
      return apiResponse.error(
        res,
        404,
        "Product with the credentials not found!"
      );
    }
    //check if the product is a parent product
    let isParentProduct = !data.parentId;
    if (isParentProduct) {
      await Product.update(
        { status: +!data.status },
        {
          where: {
            id: productId,
            shopId: shopData.id,
            deletedAt: {
              [Op.is]: null,
            },
          },
          transaction: transaction,
        }
      );
      await Product.update(
        { status: +!data.status },
        {
          where: {
            parentId: productId,
            shopId: shopData.id,
            deletedAt: {
              [Op.is]: null,
            },
          },
          transaction: transaction,
        }
      );
      await transaction.commit();
      const updated = await Product.findOne({
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
            as: "product_images"
          },
          {
            model: Category,
            as: "categories"
          },
          {
            model: Product,
            as: "sub_products",
            include: [
              {
                model: ProductImage,
                as: "product_images"
              },
            ]
          }
        ],
      });
      return apiResponse.success(res, updated);
    } else {
      await Product.update(
        { status: +!data.status },
        {
          where: {
            id: productId,
            shopId: shopData.id,
            deletedAt: {
              [Op.is]: null,
            },
          },
          transaction,
        }
      );
      await transaction.commit();
      const updated = await Product.findOne({
        where: {
          id: productId,
          shopId: shopData.id,
          deletedAt: {
            [Op.is]: null,
          },
        },
        include: ["product_images", "categories"],
      });

      return apiResponse.success(res, updated);
    }
  } catch (error) {
    console.log(error);
    try{
      await transaction.rollback();
    }catch(e){
      console.log(e)
    }
    return apiResponse.errorWithData(res, error, 400);
  }
};
