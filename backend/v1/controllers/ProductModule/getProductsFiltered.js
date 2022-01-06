const { Product, Category, ProductImage } = require("../../../db/models");
const { Op } = require("sequelize");
const db = require("../../../db/models");

module.exports = async (req, res) => {
  const { shop: shopData } = req.user;
  const possibleOrderByProperties = ["createdAt", "updatedAt", "stock"];
  const possibleOrders = ["DESC", "ASC"];
  const { isActive, inStock, page, limit, orderBy, order } = req.query;
  const pageLimit = limit ? limit : 10;
  const pageRequest = page ? page : 1;
  var filter = {
    shopId: shopData.id,
    hasVariant: false,
    // parentId: {
    //   [Op.not]: null,
    // },
    deletedAt: {
      [Op.is]: null,
    },
  };
  let queryOrderBy = "stock";
  let queryOrder = "ASC";
  if (possibleOrderByProperties.includes(orderBy)) {
    if (possibleOrders.includes(order)) {
      queryOrderBy = orderBy;
      queryOrder = order;
    }
  }
  if (isActive) {
    if (isActive === "yes") {
      filter.status = 1;
    } else {
      filter.status = 0;
    }
  }
  if (inStock) {
    if (inStock === "yes") {
      filter.stock = {
        [Op.gte]: 1,
      };
    } else {
      filter.stock = {
        [Op.lte]: 0,
      };
    }
  }
  if (!shopData) {
    return apiResponse.error(res, 400, "Create a shop first!");
  }
  try {
    const data = await Product.findAll({
      where: filter,
      // include: ["sub_products", "categories", "product_images"],
      include: [
        {
          model: ProductImage,
          as: "product_images",
        },
        {
          model: Category,
          as: "categories",
        }
      ],
      offset: (pageRequest - 1) * pageLimit,
      limit: +pageLimit,
      order: [[queryOrderBy, queryOrder]],
    });
    const dataCounts = await Product.findAll({
      where: filter,
    });
    let object = {
      counts: dataCounts.length,
      products: data,
    };
    return apiResponse.success(res, object);
  } catch (error) {
    console.log(error);
    return apiResponse.errorWithData(res, error, 400);
  }
};
