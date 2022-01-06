const shopRouter = require("express").Router();
const postNewUserShopController = require("../controllers/ShopModule/postNewUserShopRegistration");
const newUserShopValidator = require("../validators/ShopValidators/newUserShopValidator");


const postAddPaymentMethodsDetailForShop = require('../controllers/ShopModule/postAddPaymentMethodsDetailForShop');
const paymentMethodForShopValidator = require('../validators/ShopPaymentValidators/paymentMethodForShopValidator');


const {validateUser} = require("../middlewares/authenticateUserProps")


const deletePaymentMethodFormShop = require("../controllers/ShopModule/deletePaymentMethodFromShop")

const getAllPaymentMethodDetail = require('../controllers/ShopModule/getAllPaymentMethodDetail')

const getVerifyShopNameController = require('../controllers/ShopModule/getVerifyShopName');

const getVerifySlugController = require('../controllers/ShopModule/getVerifyShopSlug');
const getDetailsBySlugController = require("../controllers/ShopModule/getDetailsBySlug");
const postNewOrderController = require("../controllers/OrderModule/postNewOrder");
const postNewOrderValidator = require("../validators/OrderValidators/createNewOrderValidator");
/**
 * @swagger
 * tags:
 *  name: Shop
 *  description: The Shop managing APIS
 * */
/**
 * @swagger
 * /v1/shop/{slug}:
 *  get:
 *      tags:
 *          - Shop
 *      summary: get shop details by slug
 *      parameters:
 *        - in: path
 *          name: slug
 *          required: true
 *          type: string
 *          description: slug of the shop
 *      responses:
 *          '400':
 *              description: Shop not found           
 *
 *
 * */
 shopRouter.get("/:slug", getDetailsBySlugController);
 /**
 * @swagger
 * /v1/shop/create-order/{slug}:
 *  post:
 *      tags:
 *          - Shop
 *      summary: get shop details by slug
 *      parameters:
 *        - in: path
 *          name: slug
 *          required: true
 *          type: string
 *          description: slug of the shop
 *      responses:
 *          '400':
 *              description: Shop not found           
 *
 *
 * */
 shopRouter.post("/create-order/:slug", postNewOrderValidator, postNewOrderController)
/**
 * @swagger
 * /v1/shop:
 *  post:
 *      tags:
 *          - Shop
 *      summary: Create shop for new user
 *      requestBody:
 *          content:
 *             multipart/form-data:
 *              schema:
 *                  type: object
 *                  required:
 *                      - email
 *                      - password
 *                      - shopName
 *                      - shopAddress
 *                      - deliveryOption
 *                      - productName
 *                      - hasVariant
 *                      - shopSlug
 *                  properties:
 *                      fullName:
 *                          type: string
 *                          minLength: 3
 *                          maxLength: 25
 *                          description: Name of the user(minimum - 3, maximum - 25)
 *                      email:
 *                          required: true
 *                          type: string
 *                          minLength: 10
 *                          maxLength: 30
 *                          description: Email of the user(minimum - 10, maximum - 30)
 *                      password:
 *                          required: true
 *                          type: string
 *                          minLength: 8
 *                          description: Password for the account (minimum - 8)
 *                      shopName:
 *                          required: true
 *                          type: string
 *                          minLength: 3
 *                          maxLength: 25
 *                          description: Name of the shop(minimum - 3, maximum - 25)
 *                      shopSlug:
 *                          required: true
 *                          type: string
 *                          minLength: 3
 *                          maxLength: 100
 *                          description: Slug of the shop(minimum - 3, maximum - 100)
 *                      shopAddress:
 *                          required: true
 *                          type: string
 *                          description: Address of the shop
 *                      deliveryCityName:
 *                          required: true
 *                          type: string
 *                      deliveryDescription:
 *                          required: true
 *                          type: string
 *                      deliveryFee:
 *                          required: true
 *                          type: string
 *                      pickupCityName:
 *                          required: true
 *                          type: string
 *                      pickupFee:
 *                          required: true
 *                          type: string
 *                      pickupDescription:
 *                          required: true
 *                          type: string
 *                      shopImage:
 *                          required: false
 *                          type: file
 *                          description: Image of the shop
 *                      deliveryOption:
 *                          required: true
 *                          type: string
 *                          enum: [delivery, pickup, both]
 *                          description: Possible values are pickup/delivery/both
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
 *                          description: Price of the product
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
 *              description: User Creation successful
 *              content:
 *                application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                        data:
 *                           type: object
 *                           properties:
 *                               token:
 *                                  type: string
 *                               userDb:
 *                                  type: object
 *                                  properties:
 *                                        email:
 *                                           type: string
 *                                        fullName:
 *                                           type: string
 *                                        id:
 *                                         type: string
 *                                        isVerified:
 *                                          type: boolean
 *                                          default: false            
 *
 *
 * */
shopRouter.post("/", newUserShopValidator, postNewUserShopController);


/**
 * @swagger
 * /v1/shop/payment-method:
 *  post:
 *      tags:
 *          - Shop
 *      summary: Create new payment method for the shop
 *      parameters:
 *        - in: header
 *          name: auth-token
 *          type: string
 *          required: true
 *          description: Ex -> Bearer {token}
 *      requestBody:
 *          content:
 *             multipart/form-data:
 *              schema:
 *                  type: object
 *                  required:
 *                      - accountDetail
 *                      - paymentMethodsId
 *                  properties:
 *                      accountDetail:
 *                          type: string
 *                          minLength: 1
 *                          maxLength: 250
 *                          description: Account details(minimum - 1, maximum - 250)
 *                      paymentMethodsId:
 *                          type: string
 *                          description: Id of the payment method
 *      responses:
 *          '201':
 *              description: Payment Method Creation successful
 *              content:
 *                application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                        message:
 *                           type: string
 *                        success:
 *                           type: boolean
 *                        data:
 *                           type: object
 *                           properties:
 *                               id:
 *                                  type: string 
 *                               shopId:
 *                                  type: string 
 *                               paymentMethodsId:
 *                                  type: string  
 *                               accountDetail:
 *                                  type: string     
 *                               isVerified:
 *                                  type: boolean       
 *
 *
 * */
shopRouter.post('/payment-method', validateUser, paymentMethodForShopValidator, postAddPaymentMethodsDetailForShop)

/**
 * @swagger
 * /v1/shop/payment-method/{id}:
 *  delete:
 *      tags:
 *          - Shop
 *      summary: Create new payment method for the shop
 *      parameters:
 *        - in: header
 *          name: auth-token
 *          type: string
 *          required: true
 *          description: Ex -> Bearer {token}
 *        - in: path
 *          name: id
 *          type: string
 *          required: true
 *      responses:
 *          '201':
 *              description: Payment method deleted
 *              content:
 *                application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                        message:
 *                           type: string
 *                        success:
 *                           type: boolean      
 *
 *
 * */
shopRouter.delete('/payment-method/:id', validateUser, deletePaymentMethodFormShop)
shopRouter.get('/payment-methods', validateUser, getAllPaymentMethodDetail)

/**
 * @swagger
 * /v1/shop/check-shop/{shopName}:
 *  get:
 *      tags:
 *          - Shop
 *      summary: Check if the shopname exists or not
 *      parameters:
 *        - in: path
 *          name: shopName
 *          required: true
 *          type: string
 *          description: shopName to check
 *      responses:
 *          '400':
 *              description: Request process successfully
 *              content:
 *                application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                        success:
 *                           type: boolean
 *                           default: false
 *                        status_code:
 *                           type: number
 *                           default: 404
 *                        message:
 *                           type: string
 *                           default: shopname already taken
 *          '200':
 *              description: Request process successfully
 *              content:
 *                application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                        success:
 *                           type: boolean
 *                           default: true
 *                        status_code:
 *                           type: number
 *                           default: 200
 *                        message:
 *                           type: string
 *                        data:
 *                           type: object
 *                           properties:
 *                               status_code:
 *                                  type: number
 *                                  default: 200
 *                               message:
 *                                  type: string
 *                                  default: ShopName is valid
 *
 *
 * */
 shopRouter.get('/check-shop/:shopName', getVerifyShopNameController);
/**
 * @swagger
 * /v1/shop/check-slug/{slug}:
 *  get:
 *      tags:
 *          - Shop
 *      summary: Check if the slug is valid or not
 *      parameters:
 *        - in: path
 *          name: slug
 *          required: true
 *          type: string
 *          description: shop slug to check
 *      responses:
 *          '400':
 *              description: Request process successfully
 *              content:
 *                application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                        success:
 *                           type: boolean
 *                           default: false
 *                        status_code:
 *                           type: number
 *                           default: 404
 *                        message:
 *                           type: string
 *                           default: slug is not valid
 *          '200':
 *              description: Request process successfully
 *              content:
 *                application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                        success:
 *                           type: boolean
 *                           default: true
 *                        status_code:
 *                           type: number
 *                           default: 200
 *                        message:
 *                           type: string
 *                        data:
 *                           type: object
 *                           properties:
 *                               status_code:
 *                                  type: number
 *                                  default: 200
 *                               message:
 *                                  type: string
 *                                  default: slug is valid
 *
 *
 * */
 shopRouter.get('/check-slug/:slug', getVerifySlugController);
module.exports = shopRouter;
