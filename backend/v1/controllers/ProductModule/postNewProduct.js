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
const cloudinaryHelper = require("../../helpers/services/cloudinary/cloudInaryHelper");
const imageValidation = require("../../helpers/imageValidation.js");
module.exports = async (req, res) => {
  const {
    hasVariant,
    productName,
    productPrice,
    variantName,
    variantPrice,
    categories,
    productDescription,
    variantDescription
  } = req.body;
  const { shop: shopData } = req.user;
  const { variantImage } = req.files;
  const { variantImage: variantImagesFromBody } = req.body;
  if (!shopData) {
    return apiResponse.error(res, 400, "Create a shop first!");
  }
  const transaction = await db.sequelize.transaction();
  try {
    //fetch categories
    let categoryDatas = [];
    for (let i = 0; i < categories.length; i++) {
      categoryData = await Category.findOne({
        where: {
          shopId: shopData.id,
          id: categories[i],
          deletedAt: {
            [Op.is]: null,
          },
        },
      });
      if (!categoryData) {
        return apiResponse.error(res, 404, "Category not found!");
      }
      categoryDatas.push(categoryData.dataValues);
    }
    //////PRODUCT CREATION/////////

    let productImageExists = "productImage" in req.files || "productImage" in req.body;
    let productImageResponse = null;
    let parentProductData = null;
    if (productImageExists) {
      try {
        let isbase64 = false;
        try {
          isbase64 = imageValidation.base64(req.body.productImage);
        } catch (e) {
          isbase64 = false;
          console.error(e);
        }
        console.log("Is base 64", isbase64);
        if (isbase64) {
          let response = await cloudinaryHelper.upload(
            req.body.productImage,
            "products"
          );
          if (response.success) {
            productImageResponse = response.cloudimg;
          }
        } else {
          productImageResponse = await cloudinaryUploader(
            req.files.productImage,
            "kortex/products"
          );
        }
      } catch (e) {
        console.error(e);
      }
    }
    let slug = await getSlug(productName, Product, shopData.id);
    parentProductData = await Product.create(
      {
        name: productName,
        price: productPrice ? productPrice : "0",
        shopId: shopData.id,
        slug,
        parentId: null,
        stock: hasVariant ? 0 : 20,
        status: true,
        description: productDescription || "",
        hasVariant: !!hasVariant
      },
      { transaction }
    );
    let parentProductImage = null;
    if (!!productImageResponse) {
      parentProductImage = await ProductImage.create(
        {
          productId: parentProductData.id,
          source: productImageResponse.public_id,
        },
        { transaction }
      );
    }
    for (let m = 0; m < categories.length; m++) {
      await CategoryProduct.create(
        {
          categoryId: categories[m],
          productId: parentProductData.id,
        },
        { transaction }
      );
    }
    parentProductData.dataValues.image = parentProductImage;
    parentProductData.dataValues.categories = categoryDatas;
    parentProductData.dataValues.sub_products = [];
    //console.log(parentProductData)
    //ADD SUB PRODUCTS///
    if (hasVariant) {
      for (let i = 0; i < variantName.length; i++) {
        let productImageResponse = null;
        if (!!variantImage[i] || !!variantImagesFromBody[i]) {
          try {
            let isbase64 = false;
            try {
              isbase64 = imageValidation.base64(variantImagesFromBody[i]);
            } catch (e) {
              isbase64 = false;
            }
            if (isbase64) {
              let response = await cloudinaryHelper.upload(
                variantImagesFromBody[i],
                "products"
              );
              if (response.success) {
                productImageResponse = response.cloudimg;
              }
            } else {
              productImageResponse = await cloudinaryUploader(
                variantImage[i],
                "kortex/products"
              );
            }
          } catch (e) {
            console.error(e);
          }
        }

        let slug = await getSlug(variantName[i], Product, shopData.id);
        let productData = await Product.create({
          name: variantName[i],
          price: variantPrice[i] || "0",
          shopId: shopData.id,
          slug,
          parentId: parentProductData.id,
          stock: 20,
          status: true,
          description: variantDescription[i] || "",
          hasVariant: false
        }, {transaction});
        let productImage = null;
        
        if (!!productImageResponse) {
          productImage = await ProductImage.create(
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
        productData.dataValues.image = productImage;
        parentProductData.dataValues.sub_products = [
          ...parentProductData.dataValues.sub_products,
          productData,
        ];
      }
    }
    await transaction.commit();
    return apiResponse.success(res, {
      status_code: 200,
      message: "Product creation successful.",
      data: parentProductData,
    });
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    return apiResponse.errorWithData(res, error, 400);
  }
};
