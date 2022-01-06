const {
  CategoryProduct,
  Product,
  ProductImage,
  Category,
} = require("../../../db/models");
const { Op } = require("sequelize");
const db = require("../../../db/models");
const getSlug = require("../../helpers/slugify");
const cloudinaryUploader = require("../../helpers/services/cloudinary/upload");

module.exports = async (req, res) => {
  const { productName, productPrice, categoryId, parentId } = req.body;
  const { shop: shopData } = req.user;
  if (!shopData) {
    return apiResponse.error(res, 400, "Create a shop first!");
  }
  const transaction = await db.sequelize.transaction();
  try {
    let categoryData = null;
    if (categoryId) {
      categoryData = await Category.findOne({
        where: {
          id: categoryId,
        },
      });
      if (!categoryData) {
        return apiResponse.error(res, 404, "Category not found!");
      }
    }
    let parentProduct = await Product.findOne({
      where: {
        id: parentId,
        parentId: {
          [Op.is]: null,
        },
        deletedAt: {
          [Op.is]: null,
        },
      },
      include: "categories",
    });
    if (!parentProduct) {
      return apiResponse.error(
        res,
        404,
        "Parent-product with the id of parentId not found!"
      );
    }
    let categories = parentProduct.dataValues.categories.map(
      (obj) => obj.dataValues.id
    );
    //////PRODUCT CREATION/////////
    let productImageExists = "productImage" in req.files;
    let productImageResponse = null;
    let productData = null;
    if (productImageExists) {
      try {
        productImageResponse = await cloudinaryUploader(
          req.files.productImage,
          "kortex/products"
        );
      } catch (error) {
        console.log(error);
      }
    }
    let slug = await getSlug(productName, Product, shopData.id);
    productData = await Product.create(
      {
        name: productName,
        price: productPrice,
        shopId: shopData.id,
        slug,
        parentId,
        stock: 20,
        status: true,
      },
      { transaction }
    );
    let productImageData = null;
    if (!!productImageResponse) {
      productImageData = await ProductImage.create(
        {
          productId: productData.id,
          source: productImageResponse.public_id,
        },
        { transaction }
      );
    }
    for (let m = 0; m < categories.length; m++) {
      await CategoryProduct.create(
        {
          categoryId: categories[m],
          productId: productData.id,
        },
        { transaction }
      );
    }
    productData.dataValues.image = productImageData;

    //console.log(parentProductData)
    await transaction.commit();
    return apiResponse.success(res, productData);
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    return apiResponse.errorWithData(res, error, 400);
  }
};
