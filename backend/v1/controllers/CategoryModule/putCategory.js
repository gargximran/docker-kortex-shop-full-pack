const { Category, Shop } = require("../../../db/models");
const { Op } = require("sequelize");
const getSlug = require("../../helpers/slugify");
const cloudinaryUploader = require("../../helpers/services/cloudinary/upload");

module.exports = async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  const { id: userId, shop: shopData } = req.user;
  try {
    if (!shopData) {
      return apiResponse.error(res, 404, "Shop doesn't exist!");
    }
    if (shopData.userId !== userId) {
      return apiResponse.error(res, 401, "Not authenticated!");
    }
    const previousRecord = await Category.findOne({
      where: {
        id,
        deletedAt: {
          [Op.is]: null,
        },
      },
    });
    if (!previousRecord) {
      return apiResponse.error(res, 404, "Category not found!");
    }
    //check if the category name is unique;
    if (name) {
      const doesExists = await Category.findOne({
        where: {
          name,
          shopId: previousRecord.shopId,
          deletedAt: {
            [Op.is]: null,
          },
        },
      });
      if (doesExists) {
        return apiResponse.error(
          res,
          400,
          "Category name already exists under this shop!"
        );
      } else {
        previousRecord.name = name;
        previousRecord.slug = await getSlug(name, Category);
      }
    }

    const ifImageExists = "image" in req.files || "image" in req.body;
    if (ifImageExists) {
      let productImageResponse = null;
      let isbase64 = false;
        try {
          isbase64 = imageValidation.base64(req.body.image);
        } catch (e) {
          isbase64 = false;
          console.error(e);
        }
        if (isbase64) {
          let response = null;
          try{
            response = await cloudinaryHelper.upload(
              req.body.image,
              "categories"
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
              "kortex/categories"
            );
          }catch(e){
            productImageResponse = null;
          }
        }
      if(productImageResponse){
        previousRecord.image = response.public_id;
      }
    }
    previousRecord.updatedAt = new Date();
    await previousRecord.save();
    let object = {
      data: previousRecord,
    };
    return apiResponse.success(res, object);
  } catch (error) {
    console.log(error);
    return apiResponse.error(res, 500, error);
  }
};
