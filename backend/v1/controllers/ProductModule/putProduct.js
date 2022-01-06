const { Product, ProductImage } = require("../../../db/models");

const { Op } = require("sequelize");
const db = require("../../../db/models");
const getSlug = require("../../helpers/slugify");
const cloudinaryUploader = require("../../helpers/services/cloudinary/upload");
const cloudinaryHelper = require("../../helpers/services/cloudinary/cloudInaryHelper");
const imageValidation = require("../../helpers/imageValidation.js");
module.exports = async (req, res) => {
  const { name, price, status, stock, description } = req.body;
  const productId = req.params.productId;
  const { shop: shopData } = req.user;
  const productImageExists = "image" in req.files || "image" in req.body;
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
      include: ["product_images"],
    });
    if (!data) {
      return apiResponse.error(
        res,
        400,
        "Product with the credentials not found!"
      );
    }
    let productImageResponse = null;
    if (productImageExists) {
      let productsImagesIds = [];
      //remove images from cloudinary
      data.dataValues.product_images.map((el) => {
        productsImagesIds.push(el.dataValues.source);
      });
      // console.log("Sub products images : ", previousSubProductsImagesIds);
      for (let i = 0; i < productsImagesIds.length; i++) {
        try {
          await cloudinaryHelper.delete(productsImagesIds[i]);
        } catch (e) {
          console.error("From cloudinary", e);
        }
      }
      try {
        let isbase64 = false;
        try {
          isbase64 = imageValidation.base64(req.body.image);
        } catch (e) {
          isbase64 = false;
          console.error(e);
        }
        //console.log("Is base 64", isbase64);
        if (isbase64) {
          let response = null;
          try{
            response = await cloudinaryHelper.upload(
              req.body.image,
              "products"
            );
          }catch{
            response = null;
          }
          if (response?.success) {
            productImageResponse = response.cloudimg;
          }
        } else {
          try{
            productImageResponse = await cloudinaryUploader(
              req.files.image,
              "kortex/products"
            );
          }catch(e){
            productImageResponse = null;
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    if (!!productImageResponse) {
      await ProductImage.destroy({
        where: {
          productId: data.id,
        },
        transaction
      });
      newProductImageData = await ProductImage.create(
        {
          productId: data.id,
          source: productImageResponse.public_id,
        },
        { transaction }
      );
    }
    let newSlug = null;
    if (name) {
      newSlug = await getSlug(name, Product, shopData.id);
    }
    await Product.update(
      {
        name: name ? name : data.name,
        price: price ? price : data.price,
        status : status ? +!!status : data.status,
        stock: stock ? +stock : data.stock,
        slug: newSlug ? newSlug : data.slug,
        updatedAt: new Date(),
        description: description ? description : data.description,
      },
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
    const object = await Product.findOne({
      where: {
        id: productId,
        shopId: shopData.id,
        deletedAt: {
          [Op.is]: null,
        },
      },
      include: ["product_images"],
    });
    return apiResponse.success(res, object);
  } catch (error) {
    try {
      transaction.rollback();
    } catch (e) {
      console.error(e);
    }
    console.log(error);
    return apiResponse.errorWithData(res, error, 400);
  }
};
