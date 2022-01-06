const {
  Shop,
  Category,
  Product,
  ProductImage,
  Availability,
  CategoryProduct,
  PickupOption,
  DeliveryOption
} = require("../../../db/models");
const { Op } = require("sequelize");
module.exports = async (req, res) => {
  const slug = req.params.slug + "";
  //console.log("Slug", slug);
  try {
    const data = await Shop.findOne({
      where: {
        slug,
      },
    });
    if (!data) {
      return apiResponse.error(res, 400, "No shop found with this info!");
    }
    const pickupOptions = await PickupOption.findAll({
      where: {
        shopId: data.id,
        deletedAt: {
          [Op.is]: null,
        },
      }
    });
    const deliveryOptions = await DeliveryOption.findAll({
      where: {
        shopId: data.id,
        deletedAt: {
          [Op.is]: null,
        },
      }
    });
    const today = new Date();
    const availabilities = await Availability.findAll({
      where: {
        shopId: data.id,
        deletedAt: {
          [Op.is]: null,
        },
        date: {
          //[Op.between]: [minDate, maxDate],
          [Op.gte]: today
        },
      },
    });
    const allCategories = await Category.findAll({
      where: {
        shopId: data.id,
      }
    });
    var categoryDatas = [];
    categoryDatas = allCategories.map((obj) => obj.dataValues);
    const allCategoryIds = allCategories.map((obj) => obj.dataValues.id);
    const allCategoryProducts = await CategoryProduct.findAll({
      where: {
        categoryId: {
          [Op.in]: allCategoryIds,
        },
        deletedAt: {
            [Op.is]: null,
        },
      },
    });
    const allCategorizedProductIds = await allCategoryProducts.map(
      (obj) => obj.dataValues.productId
    );
    //console.log("All Categorized product ids", allCategorizedProductIds);
    // const allCategorizedProducts = await Categ
    const uncategorized = await Product.findAll({
      where: {
        shopId: data.id,
        deletedAt: {
          [Op.is]: null,
        },
        parentId: {
          [Op.is]: null,
        },
        status: 1,
        id: {
          [Op.notIn]: allCategorizedProductIds,
        },
      },
      include: [
        {
          model: ProductImage,
          as: "product_images",
        },
        {
          model: Product,
          as: "sub_products",
          required: false,
          where: {
            status: 1,
            // stock: {
            //   [Op.gte]: 1,
            // },
          },
          include: [
            {
              model: ProductImage,
              as: "product_images",
            },
          ],
        },
      ],
    });
    //map products under categories
    for(let i = 0; i < allCategories.length; i++){
        const currentCategoryProducts = await CategoryProduct.findAll({
            where: {
                categoryId: allCategories[i].dataValues.id
            }
        });
        const productIdsUnderThis = currentCategoryProducts.map((obj) => obj.dataValues.productId);
        let products = await Product.findAll({
            where: {
                shopId: data.id,
                deletedAt: {
                  [Op.is]: null,
                },
                parentId: {
                  [Op.is]: null,
                },
                status: 1,
                id: {
                  [Op.in]: productIdsUnderThis,
                },
              },
              include: [
                {
                  model: ProductImage,
                  as: "product_images",
                },
                {
                  model: Product,
                  as: "sub_products",
                  required: false,
                  where: {
                    status: 1,
                    // stock: {
                    //   [Op.gte]: 1,
                    // },
                  },
                  include: [
                    {
                      model: ProductImage,
                      as: "product_images",
                    },
                  ],
                },
              ],
        });
        categoryDatas[i] = {...categoryDatas[i], products};
    }
    return apiResponse.success(res, {
      availabilities,
      uncategorized,
      categories: categoryDatas,
      fulfillment: {
        deliveryOptions,
        pickupOptions
      }
    });
  } catch (error) {
    console.log(error);
    return apiResponse.errorWithData(res, error, 400);
  }
};
