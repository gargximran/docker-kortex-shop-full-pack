const {
  User,
  UserToken,
  Shop,
  PickupOption,
  DeliveryOption,
  Product,
  ProductImage,
} = require("../../../db/models");
const getSlug = require("../../helpers/slugify");
const cloudinaryUploader = require("../../helpers/services/cloudinary/upload");
const cloudinaryHelper = require("../../helpers/services/cloudinary/cloudInaryHelper");
const { generateJWT } = require("../../helpers/auth/generateJWT");
const passwordHelper = require("../../helpers/services/passwordHelper");
const db = require("../../../db/models");
const VerifyUserMail = require("../../helpers/mail/service/verify-user");
const hashMaker = require("../../helpers/hashMaker");
const imageValidation = require("../../helpers/imageValidation.js");
const { Availability } = require("../../../db/models");
const { addDays } = require("date-fns");



module.exports = async (req, res) => {
  const {
    email,
    password,
    fullName,
    hasVariant,
    productName,
    shopName,
    shopAddress,
    shopSlug,
    deliveryOption,
    productPrice,
    variantName,
    variantPrice,
    deliveryCityName,
    deliveryFee,
    deliveryDescription,
    pickupCityName,
    pickupFee,
    pickupDescription,
  } = req.body;



  const { variantImage } = req.files;
  if (shopSlug.length < 3 || shopSlug.length > 100) {
    return apiResponse.error(
      res,
      400,
      "Shop slug must be 3 to 100 characters long!"
    );
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(shopSlug)) {
    return apiResponse.error(
      res,
      400,
      "Slug must contain alphanumeric letters and no whitespace!"
    );
  }
  try {
    let doesSlugExist = await Shop.findOne({ where: { slug: shopSlug } });
    if (doesSlugExist) {
      return apiResponse.error(res, 400, "Shop with this slug already exits!");
    }
  } catch (error) {
    return apiResponse.errorWithData(res, error, 400);
  }
  try {
    let doesEmailExist = await User.findOne({ where: { email } });
    if (doesEmailExist) {
      return apiResponse.error(
        res,
        400,
        "User with this email already exists!"
      );
    }
  } catch (error) {
    return apiResponse.errorWithData(res, error, 400);
  }
  const { variantImage: variantImagesFromBody } = req.body;
  const transaction = await db.sequelize.transaction();
  try {
    ////////////USER CREATION//////////////
    const hashedPassword = await passwordHelper.hash(password);
    const { dataValues: userData } = await User.create(
      {
        email,
        fullName: fullName || "User",
        password: hashedPassword,
        isVerified: false,
      },
      { transaction }
    );
    //Generate JWT
    const {password: tokenPassword, email: tokenEmail, ...tokenParams } = userData
    const jwt = await generateJWT({...tokenParams, shopSlug});
    delete userData["password"];
    let success = {
      status_code: 200,
      message: "User creation successful.",
      data: {
        userDb: tokenParams,
        token: jwt,
      },
    };
    const token = await hashMaker(userData.email + userData.id);
    await UserToken.create(
      {
        userId: userData.id,
        token: token,
        createdAt: new Date(),
        expiredAt: new Date().setMinutes(new Date().getMinutes() + 30),
      },
      { transaction }
    );
    const client_url = process.env.CLIENT_URL || "http://localhost:3000";
    const url = `${client_url}/verify/?token=${token}`;
    //console.log(url);

    ///////////////SHOP CREATION////////////////
    let shopImageExist = "shopImage" in req.files || "shopImage" in req.body;
    let shopImageUrl = null;
    if (shopImageExist) {
      try {
        /******Check if base 64 */
        let isbase64 = false;
        try {
          isbase64 = imageValidation.base64(req.body.shopImage);
        } catch (e) {
          console.error(e);
        }
        if (isbase64) {
          // console.log("in base 64");
          let response = await cloudinaryHelper.upload(
            req.body.shopImage,
            "shops"
          );
          if (response.success) {
            shopImageUrl = response.cloudimg.public_id;
          }
        } else {
          let response = await cloudinaryUploader(
            req.files.shopImage,
            "kortex/shops"
          );
          shopImageUrl = response.public_id;
        }
      } catch (e) {
        console.error(e);
      }
    }
    const { dataValues: shopData } = await Shop.create(
      {
        name: shopName,
        userId: userData.id,
        shopAddress,
        slug: shopSlug,
        image: shopImageUrl,
        createdAt: new Date(),
      },
      { transaction }
    );
    const next7Dates = [...new Array(7).keys()].map(key => {
      return {
        shopId: shopData.id,
        date: addDays(new Date(), key)
      }
    })

    const datesN = await Availability.bulkCreate(next7Dates, {transaction})
    console.log(datesN)
    

    ///////DELIVERY AND PICKUP///////
    if (deliveryOption === "pickup") {
      await PickupOption.create(
        {
          shopId: shopData.id,
          cityName: pickupCityName,
          title: `${shopName} - pickup`,
          price: pickupFee || "0",
          currencyCode: "AUD",
          description: deliveryDescription || "Not Provided",
        },
        { transaction }
      );
    } else if (deliveryOption === "delivery") {
      await DeliveryOption.create(
        {
          shopId: shopData.id,
          title: `${shopName} - delivery`,
          cityName: deliveryCityName,
          price: deliveryFee || "0",
          currencyCode: "AUD",
          serverResponse: "Available",
          description: deliveryDescription || "Not provided",
        },
        { transaction }
      );
    } else {
      await PickupOption.create(
        {
          shopId: shopData.id,
          cityName: pickupCityName,
          title: `${shopName} - pickup`,
          price: pickupFee || "0",
          currencyCode: "AUD",
          description: pickupDescription || "Not provided",
        },
        { transaction }
      );
      await DeliveryOption.create(
        {
          shopId: shopData.id,
          cityName: deliveryCityName,
          title: `${shopName} - delivery`,
          price: deliveryFee || "0",
          currencyCode: "AUD",
          serverResponse: "Available",
          description: deliveryDescription || "Not provided",
        },
        { transaction }
      );
    }

    //////PRODUCT CREATION/////////

    let productImageExists =
      "productImage" in req.body || "productImage" in req.files;
    let productImageResponse = null;
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
    let parentProductData = await Product.create(
      {
        name: productName,
        price: productPrice ? productPrice : null,
        shopId: shopData.id,
        slug,
        parentId: null,
        stock: hasVariant ? 0 : 20,
        status: true,
        hasVariant: !!hasVariant,
      },
      { transaction }
    );
    if (!!productImageResponse) {
      await ProductImage.create(
        {
          productId: parentProductData.id,
          source: productImageResponse.public_id,
        },
        { transaction }
      );
    }
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
        let productData = await Product.create(
          {
            name: variantName[i],
            price: variantPrice[i],
            shopId: shopData.id,
            slug,
            parentId: parentProductData.id,
            stock: 20,
            status: true,
            hasVariant: false,
          },
          { transaction }
        );
        if (!!productImageResponse) {
          await ProductImage.create(
            {
              productId: productData.id,
              source: productImageResponse.public_id,
            },
            { transaction }
          );
        }
      }
    }
    await transaction.commit();
    await VerifyUserMail(userData.email, { firstName: userData.fullName, url });
    return apiResponse.success(res, success);
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    return apiResponse.errorWithData(res, error, 400);
  }
};
