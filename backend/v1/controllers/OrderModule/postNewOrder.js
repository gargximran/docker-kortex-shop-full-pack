const {
  Order,
  Shop,
  Product,
  ProductImage,
  FulfillmentWithPickup,
  FulfillmentWithDelivery,
  CartProduct,
  CartImage,
  PickupOption,
  DeliveryOption,
} = require("../../../db/models");
const db = require("../../../db/models");
module.exports = async (req, res) => {
  const {
    customerName,
    customerPhone,
    customerEmail,
    isGift,
    giftReceiverName,
    giftReceiverEmail,
    giftReceiverPhone,
    fulfillmentType,
    currencyCode,
    fulfillmentDate,
    cart,
    deliveryOptionId,
    pickupOptionId,
    deliveryAddress,
    fulfillmentDescription,
  } = req.body;
  const slug = req.params.slug + "";
  const transaction = await db.sequelize.transaction();

  try {
    const shopData = await Shop.findOne({
      where: {
        slug,
      },
      include: [
        {
          model: Product,
          as: "products",
          include: [
            {
              model: ProductImage,
              as: "product_images",
            },
          ],
        },
      ],
    });

    if (!shopData) {
      return apiResponse.error(res, 400, "No shop found with this info!");
    }
    var idPricesMap = {};
    var idImagesMap = {};
    shopData.products.forEach((obj) => {
      const productToManipulate = obj.dataValues;
      let imagesArray = [];
      if (!productToManipulate.hasVariant) {
        idPricesMap[productToManipulate.id] = {
          price: productToManipulate.price,
          name: productToManipulate.name,
        };
        productToManipulate.product_images.forEach((obj) => {
          imagesArray.push(obj.dataValues.source);
        });
        if(imagesArray.length !== 0){
          idImagesMap[productToManipulate.id] = imagesArray;
        }
      }
    });
    //console.log(idImagesMap);
    //console.log("Id Prices : ", idPricesMap);
    var cartProductsToPush = [];
    var totalOrderPrice = 0;
    for (let i = 0; i < cart.length; i++) {
      let { productId, qty } = cart[i];
      if (idPricesMap[productId]) {
        let { price, name } = idPricesMap[productId];
        let currentTotalPrice = +price * Number.parseInt(qty);
        totalOrderPrice += currentTotalPrice;
        let objToPush = {
          productId,
          currencyCode: currencyCode || "AUD",
          productName: name,
          singlePrice: price + "",
          unit: Number.parseInt(qty),
          totalPrice: currentTotalPrice,
          shopId: shopData.id,
        };
        cartProductsToPush.push(objToPush);
      } else {
        try {
          transaction.rollback();
        } catch (e) {
          console.log(e);
        }
        return apiResponse.error(
          res,
          400,
          `No product found with this id: ${productId}`
        );
      }
    }
    const order = await Order.create(
      {
        customerName,
        phone: customerPhone || "Not Provided",
        email: customerEmail || "Not Provided",
        shopId: shopData.id,
        isGift: isGift || false,
        giftReceiverEmail: !!isGift
          ? giftReceiverEmail || "Not Provided"
          : "Not Applicable",
        giftReceiverName: !!isGift
          ? giftReceiverName || "Not Provided"
          : "Not Applicable",
        giftReceiverPhone: !!isGift
          ? giftReceiverPhone || "Not Provided"
          : "Not Applicable",
        fulfillmentDate,
        fulfillmentType,
        totalPrice: totalOrderPrice,
        currencyCode: currencyCode || "AUD",
        status: "ordered",
        paymentStatus: "unpaid",
      },
      { transaction }
    );
    //Create fulfillment
    if (fulfillmentType === "delivery") {
      let deliveryOption = await DeliveryOption.findOne({
        where: {
          id: deliveryOptionId,
        },
      });
      if (!deliveryOption) {
        try {
          transaction.rollback();
        } catch (e) {
          console.log(e);
        }
        return apiResponse.error(
          res,
          400,
          "Delivery option not found with this id"
        );
      }else{
        await FulfillmentWithDelivery.create({
          deliveryOptionId,
          orderId: order.id,
          deliveryAddress,
          shopId: shopData.id,
          currencyCode: currencyCode || "AUD",
          price: deliveryOption.dataValues.price,
          description: fulfillmentDescription || "Not Provided"
        }, {transaction});
      }
    } else {
      let pickupOption = await PickupOption.findOne({
        where: { id: pickupOptionId },
      });
      if (!pickupOption) {
        try {
          transaction.rollback();
        } catch (e) {
          console.log(e);
        }
        return apiResponse.error(
          res,
          400,
          "Pick up option not found with this id"
        );
      }else{
        await FulfillmentWithPickup.create({
          pickupOptionId,
          orderId: order.id,
          shopId: shopData.id,
          currencyCode: currencyCode || "AUD",
          price: pickupOption.dataValues.price,
          description: fulfillmentDescription || "Not Required"
        }, {transaction});
      }
    }
    //Add cart producct
    for (let i = 0; i < cartProductsToPush.length; i++) {
      let obj = cartProductsToPush[i];
      let productId = obj.productId;
      const createdCart = await CartProduct.create(
        {
          ...obj,
          orderId: order.id,
        },
        { transaction }
      );
      let cartId = createdCart.id;
      console.log("ID IMAGES",idImagesMap);
      console.log("ID found: ", productId);
      if (idImagesMap[productId]) {
        let productImagesToIterate = idImagesMap[productId];
        for (let j = 0; j < productImagesToIterate.length; j++) {
          ///add cart images
          await CartImage.create(
            {
              cartId,
              source: productImagesToIterate[j],
            },
            { transaction }
          );
        }
      }
    }
    await transaction.commit();
    return apiResponse.success(res, {message: "Order created Successfully"});
  } catch (error) {
    console.error(error);
    try {
      transaction.rollback();
    } catch (e) {
      console.log(e);
    }
    return apiResponse.error(res, 500, error);
  }
};
