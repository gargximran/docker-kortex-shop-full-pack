const { Product } = require("../../../db/models");
const { Op } = require("sequelize");
const db = require("../../../db/models");

module.exports = async (req, res) => {
  const { shop: shopData } = req.user;
//   const possibleOrderByProperties = ["createdAt", "updatedAt", "stock"];
//   const possibleOrders = ["DESC", "ASC"];
  const { page, limit, search } = req.query;
  const pageLimit = limit ? limit : 10;
  const pageRequest = page ? page : 1;
  var filter = {
    shopId: shopData.id,
    deletedAt: {
      [Op.is]: null,
    },
  };
  let queryOrderBy = "createdAt";
  let queryOrder = "DESC";
  if(search){
    filter = {...filter, [Op.or]: [
      { 'name': { [Op.like]: '%' + search + '%' } },
    ]}
  }
  if (!shopData) {
    return apiResponse.error(res, 400, "Create a shop first!");
  }
  try {
    const data = await Product.findAll({
      where: filter,
      // include: ["sub_products", "categories", "product_images"],
      include: ["categories", "product_images"],
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
