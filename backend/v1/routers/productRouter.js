const productRouter = require("express").Router();
//import controllers
const postNewProductController = require("../controllers/ProductModule/postNewProduct");
const postNewChildProductController = require("../controllers/ProductModule/postSubProduct");
const deleteProductController = require("../controllers/ProductModule/deleteProduct");
const putProductController = require("../controllers/ProductModule/putProduct");
const getProductController = require("../controllers/ProductModule/getProduct");
const getAllProductsController = require("../controllers/ProductModule/getAllProducts");
const getAllFilteredProductsController = require("../controllers/ProductModule/getProductsFiltered");
const putProductToggleStatusController = require("../controllers/ProductModule/putToggleActiveStatus");
//import middlewares
const { validateUser } = require("../middlewares/authenticateUserProps");
//import validators
const newProductPostValidator = require("../validators/ProductValidators/createProductValidator");
const newSubProductValidator = require("../validators/ProductValidators/createSubProductValidator");
const updateProductValidator = require("../validators/ProductValidators/updateProductValidator");
const getAllExtractedProductsController = require("../controllers/ProductModule/getExtractedProducts");
const putUpdateParentProductController = require("../controllers/ProductModule/putUpdateParentProduct");
/**
 * definitions: 


 * 
 */
/**
 * @swagger
 * tags:
 *  name: Product
 *  description: The Product managing APIS
 * */

 productRouter.put(
  "/update-parent/:productId",
  validateUser,
  putUpdateParentProductController
);
/**
 * @swagger
 * /v1/product:
 *  post:
 *      tags:
 *          - Product
 *      summary: Create new product
  *      parameters:
 *        - in: header
 *          name: auth-token
 *          required: true
 *          type: string
 *          description: Ex -> Bearer {token}
 *      requestBody:
 *          content:
 *             multipart/form-data:
 *              schema:
 *                  type: object
 *                  required:
 *                      - fullName
 *                      - email
 *                      - password
 *                      - shopName
 *                      - shopAddress
 *                      - deliveryOption
 *                      - productName
 *                      - hasVariant
 *                  properties:
 *                      productName:
 *                          required: true
 *                          type: string
 *                          minLength: 4
 *                          maxLength: 15
 *                          description: Name of the product(minimum - 4, maximum - 15)
 *                      productPrice:
 *                          type: string
 *                          description: Price of product(***Required if hasVariant = false)
 *                      productImage:
 *                          required: false
 *                          type: file
 *                          description: Picture of the product
 *                      categories:
 *                          type: array
 *                          description: Includes the ids of the categories.Can be an empty array
 *                          items:
 *                             type: string
 *                      hasVariant:
 *                          required: true
 *                          type: boolean
 *                          description: If the product has sub products or not
 *                      variantName:
 *                          type: array
 *                          items:
 *                             type: string
 *                          description: Name of sub-products(***Required if hasVariant = false.Length of the variantImage, variantPrice and variantName must be same)
 *                      variantPrice:
 *                          type: array
 *                          items:
 *                             type: string
 *                          description: Price of sub-products(***Required if hasVariant = false.Length of the variantImage, variantPrice and variantName must be same)
 *                      variantImage:
 *                          type: array
 *                          items:
 *                             type: file
 *                          allowMultiple: true
 *                          description: Image of sub-products(***Required if hasVariant =  false.Length of the variantImage, variantPrice and variantName must be same)
 *              encoding:
 *                  image:
 *                      contentType: image/*
 *
 *
 *      responses:
 *          '200':
 *              description: Product Creation successful
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      success: 
 *                         type: boolean
 *                      status_code: 
 *                         type: number
 *                         example: 200
 *                      message: 
 *                         type: string
 *                         example: Request process successfully
 *                      data: 
*                          type: object
*                          properties: 
*                             id: 
*                               type: string
*                             createdAt: 
*                               type: string
*                             updatedAt: 
*                               type: string
*                             deletedAt: 
*                               type: string
*                               format: nullable
*                             name: 
*                               type: string
*                             price: 
*                                type: string
*                                format: nullable
*                             shopId: 
*                                 type: string
*                             slug: 
*                                 type: string
*                             parentId: 
*                                 type: string
*                                 format: nullable
*                             stock: 
*                                  type: number
*                             status: 
*                                  type: boolean
*                             image: 
*                                  type: object
*                                  properties: 
*                                     id: 
*                                        type: string
*                                     createdAt: 
*                                        type: string
*                                     updatedAt: 
*                                        type: string
*                                     deletedAt: 
*                                        type: string
*                                        format: nullable
*                                     productId: 
*                                        type: string
*                                     source: 
*                                        type: string
*                             categories:
*                                   type: array
*                                   items: 
*                                       type: object
*                                       properties: 
*                                           id: 
*                                             type: string
*                                           name: 
*                                             type: string
*                                           slug: 
*                                             type: string
*                                           image: 
*                                             type: string
*                                           shopId: 
*                                             type: string
*                             sub_products:
*                                   type: array
*                                   items: 
*                                       type: object
*                                       properties: 
*                                           id: 
*                                             type: string
*                                           name: 
*                                             type: string
*                                           slug: 
*                                             type: string
*                                           price: 
*                                             type: string
*                                           shopId: 
*                                             type: string
*                                           parentId: 
*                                             type: string
*                                           stock: 
*                                             type: number
*                                           status: 
*                                             type: boolean
*                                           image: 
*                                             type: object
*                                             properties: 
*                                                 id:
*                                                   type: string
*                                                 source:
*                                                   type: string
*                                                 productId:
*                                                   type: string
*                                                    
    *          '404':
 *              description: Product Creation failed
 *              content:
 *                application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                        success:
 *                            type: boolean
 *                            default: false
 *                        status_code:
 *                            type: number
 *                            default: 404
 *                        message:
 *                            type: string
   *          '400':
 *              description: Bad Request
 *              content:
 *                application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                        success:
 *                            type: boolean
 *                            default: false
 *                        status_code:
 *                            type: number
 *                            default: 400
 *                        message:
 *                            type: string
 *
 * */
productRouter.post(
  "/",
  newProductPostValidator,
  validateUser,
  postNewProductController
);
/**
 * @swagger
 * /v1/product/child:
 *  post:
 *      tags:
 *          - Product
 *      summary: Add new sub product under a parent product
  *      parameters:
 *        - in: header
 *          name: auth-token
 *          required: true
 *          type: string
 *          description: Ex -> Bearer {token}
 *      requestBody:
 *          content:
 *             multipart/form-data:
 *              schema:
 *                  type: object
 *                  required:
 *                      - productName
 *                      - productPrice
 *                      - parentId
 *                  properties:
 *                      productName:
 *                          required: true
 *                          type: string
 *                          minLength: 4
 *                          maxLength: 15
 *                          description: Name of the product(minimum - 4, maximum - 15)
 *                      productPrice:
 *                          type: string
 *                          description: Price of product(***Required if hasVariant = false)
 *                      productImage:
 *                          required: false
 *                          type: file
 *                          description: Picture of the product
 *                      parentId:
 *                          required: true
 *                          type: string
 *                          description: ParentId of the product
 *                          items:
 *                             type: string
 *                      categoryId:
 *                          required: true
 *                          type: string
 *                          description: CategoryId of the product
 *                          items:
 *                             type: string
 *              encoding:
 *                  image:
 *                      contentType: image/*
 *
 *
 *      responses:
 *          '200':
 *              description: Product Creation successful
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      success: 
 *                         type: boolean
 *                      status_code: 
 *                         type: number
 *                         example: 200
 *                      message: 
 *                         type: string
 *                         example: Request processed successfully
 *                      data: 
*                          type: object
*                          properties: 
*                             id: 
*                               type: string
*                             createdAt: 
*                               type: string
*                             updatedAt: 
*                               type: string
*                             deletedAt: 
*                               type: string
*                               format: nullable
*                             name: 
*                               type: string
*                             price: 
*                                type: string
*                                format: nullable
*                             shopId: 
*                                 type: string
*                             slug: 
*                                 type: string
*                             parentId: 
*                                 type: string
*                                 format: nullable
*                             stock: 
*                                  type: number
*                             status: 
*                                  type: boolean
*                             image: 
*                                  type: object
*                                  properties: 
*                                     id: 
*                                        type: string
*                                     createdAt: 
*                                        type: string
*                                     updatedAt: 
*                                        type: string
*                                     deletedAt: 
*                                        type: string
*                                        format: nullable
*                                     productId: 
*                                        type: string
*                                     source: 
*                                        type: string
*                                                    
    *          '404':
 *              description: Product Creation failed
 *              content:
 *                application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                        success:
 *                            type: boolean
 *                            default: false
 *                        status_code:
 *                            type: number
 *                            default: 404
 *                        message:
 *                            type: string
   *          '400':
 *              description: Bad Request
 *              content:
 *                application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                        success:
 *                            type: boolean
 *                            default: false
 *                        status_code:
 *                            type: number
 *                            default: 400
 *                        message:
 *                            type: string
 *
 * */
productRouter.post(
  "/child",
  newSubProductValidator,
  validateUser,
  postNewChildProductController
);
/**
 * @swagger
 * /v1/product/{productId}:
 *  delete:
 *      tags:
 *          - Product
 *      summary: API for deleting the Product
 *      parameters:
 *        - in: header
 *          name: auth-token
 *          type: string
 *          description: Ex -> Bearer {token}
 *        - in: path
 *          name: productId
 *          required: true
 *          description: ID of the product
 *          schema:
 *              type: string
 *      responses:
 *          '200':
 *              description: Removed successfully
 *
 * */
productRouter.delete("/:productId", validateUser, deleteProductController);
/**
 * @swagger
 * /v1/product/{productId}:
 *  put:
 *      tags:
 *          - Product
 *      summary: Edit info about a product
  *      parameters:
 *        - in: header
 *          name: auth-token
 *          required: true
 *          type: string
 *          description: Ex -> Bearer {token}
  *        - in: path
 *          name: productId 
 *          required: true
 *          description: ID of the product
 *          schema:
 *              type: string
  *      requestBody:
 *          content:
 *             multipart/form-data:
 *              schema:
 *                  type: object
 *                  properties:
 *                      name:
 *                          type: string
 *                          minLength: 4
 *                          maxLength: 15
 *                          description: Name of the product(minimum - 4, maximum - 15)
 *                      stock:
 *                          type: string
 *                          description: Stock of the product
 *                      price:
 *                          type: string
 *                          description: Price of the product
 *                      status:
 *                          type: boolean
 *                          description: Status of the product
 *                      image:
 *                          required: false
 *                          type: file
 *                          description: Picture of the product
 *      responses:
 *          '200':
 *              description: Request process successfully
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      success: 
 *                         type: boolean
 *                      status_code: 
 *                         type: number
 *                         example: 200
 *                      message: 
 *                         type: string
 *                         example: Request processed successfully
 *                      data: 
*                          type: object
*                          properties:
*                                           id:
*                                              type: string
*                                           slug:
*                                              type: string
*                                           name:
*                                              type: string
*                                           shopId:
*                                              type: string
*                                           price:
*                                              type: string
*                                           stock:
*                                              type: number
*                                           status:
*                                              type: boolean
*                                           createdAt:
*                                              type: string
*                                           updatedAt:
*                                              type: string
*                                           parentId:
*                                              type: string
*                                              nullable: true
*                                           product_images:
*                                              type: array
*                                              items:
*                                                   type: object
*                                                   properties:
*                                                      id:
*                                                         type: string
*                                                      productId:
*                                                         type: string 
*                                                      source:
*                                                         type: string  
*                                                      createdAt:
*                                                         type: string 
*                                                      updatedAt:
*                                                          type: string                                             
* */
productRouter.put(
  "/:productId",
  updateProductValidator,
  validateUser,
  putProductController
);
/**
 * @swagger
 * /v1/product/toggle/{productId}:
 *  put:
 *      tags:
 *          - Product
 *      summary: Edit info about a product
  *      parameters:
 *        - in: header
 *          name: auth-token
 *          required: true
 *          type: string
 *          description: Ex -> Bearer {token}
  *        - in: path
 *          name: productId 
 *          required: true
 *          description: ID of the product
 *          schema:
 *              type: string
 *      responses:
 *          '200':
 *              description: Request process successfully
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      success: 
 *                         type: boolean
 *                      status_code: 
 *                         type: number
 *                         example: 200
 *                      message: 
 *                         type: string
 *                         example: Request processed successfully
 *                      data: 
*                          type: object
*                          properties:
*                                           id:
*                                              type: string
*                                           slug:
*                                              type: string
*                                           name:
*                                              type: string
*                                           shopId:
*                                              type: string
*                                           price:
*                                              type: string
*                                           stock:
*                                              type: number
*                                           status:
*                                              type: boolean
*                                           createdAt:
*                                              type: string
*                                           updatedAt:
*                                              type: string
*                                           parentId:
*                                              type: string
*                                              nullable: true
*                                           product_images:
*                                              type: array
*                                              items:
*                                                   type: object
*                                                   properties:
*                                                      id:
*                                                         type: string
*                                                      productId:
*                                                         type: string 
*                                                      source:
*                                                         type: string  
*                                                      createdAt:
*                                                         type: string 
*                                                      updatedAt:
*                                                          type: string                                             
* */
productRouter.put(
  "/toggle/:productId",
  validateUser,
  putProductToggleStatusController
);
/**
 * @swagger
 * /v1/product/filtered:
 *  get:
 *      tags:
 *          - Product
 *      summary: Get list of all filtered products(without parent)
 *      parameters:
 *        - in: header
 *          name: auth-token
 *          required: true
 *          type: string
 *          description: Ex -> Bearer {token}
 *        - in: query
 *          name: orderBy
 *          description: "Property you want to order by"
 *          schema:
 *              type: string
 *              enum: [createdAt, updatedAt, stock]
 *        - in: query
 *          name: order
 *          description: "In which order you want to sort"
 *          schema:
 *              type: string
 *              enum: [ASC, DESC]
 *        - in: query
 *          name: inStock
 *          description: "Choose if the product is in stock or not"
 *          schema:
 *              type: string
 *              enum: [yes, no]
 *        - in: query
 *          name: isActive
 *          description: "Choose if the product is actively selling or not"
 *          schema:
 *              type: string
 *              enum: [yes, no]
 *        - in: query
 *          name: limit
 *          type: number
 *          description: "How many entries should be there in each page"
 *        - in: query
 *          name: page
 *          type: number
 *          description: "Page number you want to get"
 *          schema:
 *              type: number
 *      responses:
 *          '200':
 *              description: Request process successfully
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      success: 
 *                         type: boolean
 *                      status_code: 
 *                         type: number
 *                         example: 200
 *                      message: 
 *                         type: string
 *                         example: Request processed successfully
 *                      data: 
*                          type: object
*                          properties:
*                               counts: 
*                                   type: number
*                               products:
*                                   type: array
*                                   items:
*                                       type: object
*                                       properties:
*                                           id:
*                                              type: string
*                                           slug:
*                                              type: string
*                                           name:
*                                              type: string
*                                           shopId:
*                                              type: string
*                                           price:
*                                              type: string
*                                           stock:
*                                              type: number
*                                           status:
*                                              type: number
*                                           createdAt:
*                                              type: string
*                                           updatedAt:
*                                              type: string
*                                           parentId:
*                                              type: string
*                                              nullable: true  
*                                           categories:
*                                              type: array
*                                              items:
*                                                   type: object
*                                                   properties:
*                                                      id:
*                                                         type: string
*                                                      name:
*                                                         type: string
*                                                      slug:
*                                                         type: string
*                                                      shopId:
*                                                         type: string 
*                                                      image:
*                                                         type: string  
*                                                      createdAt:
*                                                         type: string 
*                                                      updatedAt:
*                                                          type: string
*                                           product_images:
*                                              type: array
*                                              items:
*                                                   type: object
*                                                   properties:
*                                                      id:
*                                                         type: string
*                                                      productId:
*                                                         type: string 
*                                                      source:
*                                                         type: string  
*                                                      createdAt:
*                                                         type: string 
*                                                      updatedAt:
*                                                          type: string                                             
* */
productRouter.get("/filtered", validateUser, getAllFilteredProductsController);
/**
 * @swagger
 * /v1/product/extracted:
 *  get:
 *      tags:
 *          - Product
 *      summary: Get list of all products(paginated)
 *      parameters:
 *        - in: header
 *          name: auth-token
 *          required: true
 *          type: string
 *          description: Ex -> Bearer {token}
 *        - in: query
 *          name: limit
 *          type: number
 *          description: "How many entries should be there in each page"
 *        - in: query
 *          name: page
 *          type: number
 *          description: "Page number you want to get"
 *          schema:
 *              type: number
 *        - in: query
 *          name: search
 *          type: string
 *          description: "Product name search"
 *          schema:
 *              type: string
 *      responses:
 *          '200':
 *              description: Request process successfully
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      success: 
 *                         type: boolean
 *                      status_code: 
 *                         type: number
 *                         example: 200
 *                      message: 
 *                         type: string
 *                         example: Request processed successfully
 *                      data: 
*                          type: object
*                          properties:
*                               counts: 
*                                   type: number
*                               products:
*                                   type: array
*                                   items:
*                                       type: object
*                                       properties:
*                                           id:
*                                              type: string
*                                           slug:
*                                              type: string
*                                           name:
*                                              type: string
*                                           shopId:
*                                              type: string
*                                           price:
*                                              type: string
*                                           stock:
*                                              type: number
*                                           status:
*                                              type: number
*                                           createdAt:
*                                              type: string
*                                           updatedAt:
*                                              type: string
*                                           parentId:
*                                              type: string
*                                              nullable: true  
*                                           categories:
*                                              type: array
*                                              items:
*                                                   type: object
*                                                   properties:
*                                                      id:
*                                                         type: string
*                                                      name:
*                                                         type: string
*                                                      slug:
*                                                         type: string
*                                                      shopId:
*                                                         type: string 
*                                                      image:
*                                                         type: string  
*                                                      createdAt:
*                                                         type: string 
*                                                      updatedAt:
*                                                          type: string
*                                           product_images:
*                                              type: array
*                                              items:
*                                                   type: object
*                                                   properties:
*                                                      id:
*                                                         type: string
*                                                      productId:
*                                                         type: string 
*                                                      source:
*                                                         type: string  
*                                                      createdAt:
*                                                         type: string 
*                                                      updatedAt:
*                                                          type: string                                             
* */
productRouter.get("/extracted", validateUser, getAllExtractedProductsController);
/**
 * @swagger
 * /v1/product/{productId}:
 *  get:
 *      tags:
 *          - Product
 *      summary: Get details about a product
  *      parameters:
 *        - in: header
 *          name: auth-token
 *          required: true
 *          type: string
 *          description: Ex -> Bearer {token}
  *        - in: path
 *          name: productId 
 *          required: true
 *          description: ID of the product
 *          schema:
 *              type: string
 *      responses:
 *          '200':
 *              description: Request process successfully
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      success: 
 *                         type: boolean
 *                      status_code: 
 *                         type: number
 *                         example: 200
 *                      message: 
 *                         type: string
 *                         example: Request processed successfully
 *                      data: 
*                          type: object
*                          properties:
*                               message: 
*                                   type: string
*                               product:
*                                       type: object
*                                       properties:
*                                           id:
*                                              type: string
*                                           slug:
*                                              type: string
*                                           name:
*                                              type: string
*                                           shopId:
*                                              type: string
*                                           price:
*                                              type: string
*                                           stock:
*                                              type: number
*                                           status:
*                                              type: number
*                                           createdAt:
*                                              type: string
*                                           updatedAt:
*                                              type: string
*                                           parentId:
*                                              type: string
*                                              nullable: true
*                                           sub_products:
*                                              type: array
*                                              items:
*                                                   type: object
*                                                   properties:
*                                                      id:
*                                                         type: string
*                                                      name:
*                                                         type: string
*                                                      slug:
*                                                         type: string
*                                                      shopId:
*                                                         type: string  
*                                                      price:
*                                                         type: string 
*                                                      stock:
*                                                         type: number 
*                                                      status:
*                                                         type: number 
*                                                      createdAt:
*                                                         type: string 
*                                                      updatedAt:
*                                                         type: string   
*                                           categories:
*                                              type: array
*                                              items:
*                                                   type: object
*                                                   properties:
*                                                      id:
*                                                         type: string
*                                                      name:
*                                                         type: string
*                                                      slug:
*                                                         type: string
*                                                      shopId:
*                                                         type: string 
*                                                      image:
*                                                         type: string  
*                                                      createdAt:
*                                                         type: string 
*                                                      updatedAt:
*                                                          type: string
*                                           product_images:
*                                              type: array
*                                              items:
*                                                   type: object
*                                                   properties:
*                                                      id:
*                                                         type: string
*                                                      productId:
*                                                         type: string 
*                                                      source:
*                                                         type: string  
*                                                      createdAt:
*                                                         type: string 
*                                                      updatedAt:
*                                                          type: string                                             
* */
productRouter.get("/:productId", validateUser, getProductController);
/**
 * @swagger
 * /v1/product:
 *  get:
 *      tags:
 *          - Product
 *      summary: Get list of all products
  *      parameters:
 *        - in: header
 *          name: auth-token
 *          required: true
 *          type: string
 *          description: Ex -> Bearer {token}
 *      responses:
 *          '200':
 *              description: Request process successfully
 *              content:
 *                application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      success: 
 *                         type: boolean
 *                      status_code: 
 *                         type: number
 *                         example: 200
 *                      message: 
 *                         type: string
 *                         example: Request processed successfully
 *                      data: 
*                          type: object
*                          properties:
*                               message: 
*                                   type: string
*                               products:
*                                   type: array
*                                   items:
*                                       type: object
*                                       properties:
*                                           id:
*                                              type: string
*                                           slug:
*                                              type: string
*                                           name:
*                                              type: string
*                                           shopId:
*                                              type: string
*                                           price:
*                                              type: string
*                                           stock:
*                                              type: number
*                                           status:
*                                              type: number
*                                           createdAt:
*                                              type: string
*                                           updatedAt:
*                                              type: string
*                                           parentId:
*                                              type: string
*                                              nullable: true
*                                           sub_products:
*                                              type: array
*                                              items:
*                                                   type: object
*                                                   properties:
*                                                      id:
*                                                         type: string
*                                                      name:
*                                                         type: string
*                                                      slug:
*                                                         type: string
*                                                      shopId:
*                                                         type: string  
*                                                      price:
*                                                         type: string 
*                                                      stock:
*                                                         type: number 
*                                                      status:
*                                                         type: number 
*                                                      createdAt:
*                                                         type: string 
*                                                      updatedAt:
*                                                         type: string   
*                                           categories:
*                                              type: array
*                                              items:
*                                                   type: object
*                                                   properties:
*                                                      id:
*                                                         type: string
*                                                      name:
*                                                         type: string
*                                                      slug:
*                                                         type: string
*                                                      shopId:
*                                                         type: string 
*                                                      image:
*                                                         type: string  
*                                                      createdAt:
*                                                         type: string 
*                                                      updatedAt:
*                                                          type: string
*                                           product_images:
*                                              type: array
*                                              items:
*                                                   type: object
*                                                   properties:
*                                                      id:
*                                                         type: string
*                                                      productId:
*                                                         type: string 
*                                                      source:
*                                                         type: string  
*                                                      createdAt:
*                                                         type: string 
*                                                      updatedAt:
*                                                          type: string                                             
* */
productRouter.get("/", validateUser, getAllProductsController);

module.exports = productRouter;
