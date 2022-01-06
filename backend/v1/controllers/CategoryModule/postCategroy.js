const { Category, Shop } = require("../../../db/models");
const { Op } = require("sequelize");
const getSlug = require("../../helpers/slugify");
const cloudinaryUploader = require("../../helpers/services/cloudinary/upload");
const imageValidation = require("../../helpers/imageValidation.js");
const cloudinaryHelper = require("../../helpers/services/cloudinary/cloudInaryHelper");

module.exports = async (req, res) => {
  const { name } = req.body;
  const { id: userId, shop: shopData } = req.user;
  try {
    if (!shopData) {
      return apiResponse.error(res, 404, "Shop doesn't exist!");
    }
    if (shopData.userId !== userId) {
      return apiResponse.error(res, 401, "Not authenticated!");
    }
    //Check if the category name is unique
    const doesExist = await Category.findOne({
      where: {
        shopId: shopData.id,
        name,
        deletedAt: {
          [Op.is]: null,
        },
      },
    });
    if (doesExist) {
      return apiResponse.error(
        res,
        400,
        "Category name already exists under this shop!"
      );
    }
    const ifImageExists = "image" in req.files || "image" in req.body;
    let imageSource = null;
    if (ifImageExists) {
      try {
        /******Check if base 64 */
        let isbase64 = false;
        try {
          isbase64 = imageValidation.base64(req.body.image);
        } catch (e) {
          console.error(e);
        }
        if (isbase64) {
          // console.log("in base 64");
          let response = await cloudinaryHelper.upload(
            req.body.image,
            "categories"
          );
          if (response.success) {
            imageSource = response.cloudimg.public_id;
          }
        } else {
          let response = await cloudinaryUploader(
            req.files.image,
            "kortex/categories"
          );
          imageSource = response.public_id;
        }
      } catch (e) {
        console.error(e);
      }
    }
    const slug = await getSlug(name, Category);
    const data = await Category.create({
      name,
      slug,
      shopId: shopData.id,
      image: imageSource,
      createdAt: new Date(),
    });
    return apiResponse.success(res, data);
  } catch (error) {
    console.error(error);
    return apiResponse.error(res, 500, error);
  }
};
