const {
  Product,
  ProductImage,
  Category,
  CategoryProduct,
} = require("../../../db/models");
const { Op } = require("sequelize");
const getSlug = require("../../helpers/slugify");
const db = require("../../../db/models");
const cloudinaryHelper = require("../../helpers/services/cloudinary/cloudInaryHelper");

module.exports = async (req, res) => {
  const {
    categories,
    productName,
    productPrice,
    hasVariant,
    productDescription,
    productImage,
    productStock,
    subProducts,
    slug: productSlug,
  } = req.body;
  const productId = req.params.productId;
  const { shop: shopData } = req.user;
  if (!shopData) {
    return apiResponse.error(res, 400, "Create a shop first!");
  }
  const transaction = await db.sequelize.transaction();
  try {
    //fetch categories
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
    }
    //GET THE PRODUCT FROM THE DATABASE
    const previousProduct = await Product.findOne({
      where: {
        id: productId,
        shopId: shopData.id,
        deletedAt: {
          [Op.is]: null,
        },
      },
      include: [
        {
          model: ProductImage,
          as: "product_images",
        },
        {
          model: Category,
          as: "categories",
        },
        {
          model: Product,
          as: "sub_products",
          include: [
            {
              model: ProductImage,
              as: "product_images",
            },
            {
              model: Category,
              as: "categories",
            },
          ],
        },
      ],
    });
    if (!previousProduct) {
      return apiResponse.error(
        res,
        400,
        "Product with the credentials not found!"
      );
    }
    const previouslySubscribedCategories =
      previousProduct.dataValues.categories.map((obj) => obj?.id);
    console.log(previouslySubscribedCategories);
    //////**************************PARENT PRODUCT UPDATE BASED ON hasVariant******************************/////////

    const categoriesHavetoIterateThrough = [
      ...new Set([...categories, ...previouslySubscribedCategories]),
    ];
    let productImageExists = !!productImage;
    let productImageResponse = null;
    if (productImageExists) {
      try {
        let response = await cloudinaryHelper.upload(productImage, "products");
        if (response.success) {
          productImageResponse = response.cloudimg;
        }
      } catch (e) {
        console.error(e);
      }
      previousProduct.dataValues.product_images.map(async (obj) => {
        let ex = obj.dataValues;
        try {
          await ProductImage.destroy({
            where: {
              id: ex?.id,
            },
            transaction,
          });
        } catch (e) {
          console.error(e);
        }
        //also remove from cloudinary
        try {
          await cloudinaryHelper.delete(obj.source);
        } catch (e) {
          console.log(e);
        }
      });
      if (!!productImageResponse) {
        await ProductImage.create(
          {
            productId: productId,
            source: productImageResponse.public_id,
          },
          { transaction }
        );
      }
    }
    let slug = productSlug;
    //check if you have to generate new slug or not
    if (productName !== previousProduct.dataValues.name) {
      slug = await getSlug(productName, Product, shopData.id);
    }
    await Product.update(
      {
        name: productName,
        price: productPrice,
        shopId: shopData.id,
        slug,
        parentId: null,
        stock: hasVariant ? 0 : productStock,
        status: true,
        description: productDescription || "",
        hasVariant: !!hasVariant,
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
    //update categories subscriptions as well
    for (let m = 0; m < categoriesHavetoIterateThrough.length; m++) {
      let catId = categoriesHavetoIterateThrough[m];
      //have to create new one
      if (
        categories.includes(catId) &&
        !previouslySubscribedCategories.includes(catId)
      ) {
        await CategoryProduct.create(
          {
            categoryId: categories[m],
            productId,
          },
          { transaction }
        );
      }
      //have to remove
      else if (
        !categories.includes(catId) &&
        previouslySubscribedCategories.includes(catId)
      ) {
        await CategoryProduct.destroy({
          where: {
            productId,
            categoryId: catId,
          },
          transaction,
        });
      }
    }

    //console.log(parentProductData)
    ////*****************************************REMOVE SUB products if hasVariant === false*********/
    let previousSubProductsIds = previousProduct.dataValues.sub_products.map(
      (obj) => obj.dataValues.id
    );
    if (!hasVariant) {
      let previousSubProductsImagesIds = [];
      //remove images from cloudinary
      previousProduct.dataValues.sub_products.map((obj) => {
        obj.dataValues.product_images.map((el) => {
          previousSubProductsImagesIds.push(el.dataValues.source);
        });
      });
      // console.log("Sub products images : ", previousSubProductsImagesIds);
      for (let i = 0; i < previousSubProductsImagesIds.length; i++) {
        try {
          await cloudinaryHelper.delete(previousSubProductsImagesIds[i]);
        } catch (e) {
          console.error("From cloudinary", e);
        }
      }
      for (let i = 0; i < previousSubProductsIds.length; i++) {
        let id = previousSubProductsIds[i];
        await ProductImage.destroy({
          where: {
            productId: id,
          },
          transaction,
        });
        await Product.destroy({
          where: {
            id,
            parentId: productId,
          },
          transaction,
        });
        await CategoryProduct.destroy({
          where: {
            productId: id,
          },
          transaction,
        });
      }
    }
    ////////******************HANDLE EDIT OF THE SUB PRODUCTS********/
    else {
      let passedSubProductIdsToDelete = [];
      let subProductIds = [];
      subProducts.forEach((obj) => {
        if (obj.id) {
          subProductIds.push(obj.id);
        }
      });
      previousSubProductsIds.forEach((id) => {
        if (!subProductIds.includes(id)) {
          passedSubProductIdsToDelete.push(id);
        }
      });
      //remove all deleted subproducts
      for (let k = 0; k < passedSubProductIdsToDelete.length; k++) {
        let deleteId = passedSubProductIdsToDelete[k];
        const productImagesToDelete = await ProductImage.findAll({
          where: {
            id: deleteId,
          },
        });
        for (let q = 0; q < productImagesToDelete.length; q++) {
          try {
            await cloudinaryHelper.delete(
              productImagesToDelete[q].dataValues?.source
            );
          } catch (e) {
            console.error("Cloudinary error : ", e);
          }
        }
        await Product.destroy({
          where: {
            id: deleteId,
          },
          transaction,
        });
        await CategoryProduct.destroy({
          where: {
            productId: deleteId,
          },
          transaction,
        });
        await CategoryProduct.destroy({
          where: {
            productId: deleteId,
          },
          transaction,
        });
      }
      for (let k = 0; k < subProducts.length; k++) {
        let productToManipulate = subProducts[k];
        const {
          price,
          stock,
          name,
          description,
          slug: productSlug,
          image,
        } = productToManipulate;
        // let previousSubProductsIds =
        //   previousProduct.dataValues.sub_products.map(
        //     (obj) => obj.dataValues.id
        //   );
        //insert new one
        if (!productToManipulate.id) {
          let slug = await getSlug(name, Product, shopData.id);
          let productImageResponse = null;
          try {
            let response = await cloudinaryHelper.upload(image, "products");
            if (response.success) {
              productImageResponse = response.cloudimg;
            }
          } catch (e) {
            console.error(e);
          }
          const created = await Product.create(
            {
              name,
              price: price ? Math.abs(+price) + "" : "0",
              shopId: shopData.id,
              slug: slug,
              parentId: productId,
              stock: +stock,
              status: true,
              description: description || "",
              hasVariant: false,
            },
            { transaction }
          );
          if (!!productImageResponse) {
            await ProductImage.create(
              {
                productId: created.id,
                source: productImageResponse.public_id,
              },
              { transaction }
            );
          }
          for (let j = 0; j < categories.length; j++) {
            await CategoryProduct.create(
              {
                categoryId: categories[j],
                productId: created.id,
              },
              { transaction }
            );
          }
        }
        ///UPDATE PRODUCT
        else if (previousSubProductsIds.includes(productToManipulate.id)) {
          ///////////*******************************/
          let productImageExists = !!image;
          let productImageResponse = null;
          if (productImageExists) {
            try {
              let response = await cloudinaryHelper.upload(image, "products");
              if (response.success) {
                productImageResponse = response.cloudimg;
              }
            } catch (e) {
              console.error(e);
            }
            productToManipulate.product_images.map(async (obj) => {
              try {
                await ProductImage.destroy({
                  where: {
                    id: obj.id,
                  },
                  transaction,
                });
              } catch (e) {
                console.error(e);
              }
              //also remove from cloudinary
              try {
                await cloudinaryHelper.delete(obj.source);
              } catch (e) {
                console.log(e);
              }
            });
            if (!!productImageResponse) {
              await ProductImage.create(
                {
                  productId: productToManipulate.id,
                  source: productImageResponse.public_id,
                },
                { transaction }
              );
            }
          }
          let slug = await getSlug(name, Product, shopData.id);

          await Product.update(
            {
              name,
              price: price ? Math.abs(+price) + "" : "0",
              shopId: shopData.id,
              slug: slug,
              parentId: productId,
              stock: +stock,
              status: true,
              description: description || "",
              hasVariant: false,
            },
            {
              where: {
                id: productToManipulate.id,
                shopId: shopData.id,
                deletedAt: {
                  [Op.is]: null,
                },
              },
              transaction,
            }
          );
          //update categories subscriptions as well
          for (let m = 0; m < categoriesHavetoIterateThrough.length; m++) {
            let catId = categoriesHavetoIterateThrough[m];
            //have to create new one
            if (
              categories.includes(catId) &&
              !previouslySubscribedCategories.includes(catId)
            ) {
              await CategoryProduct.create(
                {
                  categoryId: categories[m],
                  productId: productToManipulate.id,
                },
                { transaction }
              );
            }
            //have to remove
            else if (
              !categories.includes(catId) &&
              previouslySubscribedCategories.includes(catId)
            ) {
              await CategoryProduct.destroy({
                where: {
                  productId: productToManipulate.id,
                  categoryId: catId,
                },
                transaction,
              });
            }
          }
          /////*************************************/
        }
      }
    }
    await transaction.commit();
    //GET THE PRODUCT FROM THE DATABASE
    const product = await Product.findOne({
      where: {
        id: productId,
        shopId: shopData.id,
        deletedAt: {
          [Op.is]: null,
        },
      },
      include: [
        {
          model: ProductImage,
          as: "product_images",
        },
        {
          model: Category,
          as: "categories",
        },
        {
          model: Product,
          as: "sub_products",
          include: [
            {
              model: ProductImage,
              as: "product_images",
            },
            {
              model: Category,
              as: "categories",
            },
          ],
        },
      ],
    });
    return apiResponse.success(res, {
      status_code: 200,
      message: "Product creation successful.",
      product,
    });
  } catch (error) {
    try {
      await transaction.rollback();
    } catch (e) {
      console.log(e);
    }
    console.log(error);
    return apiResponse.errorWithData(res, error, 400);
  }
};
