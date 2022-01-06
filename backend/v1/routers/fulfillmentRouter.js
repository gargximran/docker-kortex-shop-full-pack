const fulfillmentRouter = require("express").Router();
//import controllers
const getFulFillmentOptionsController = require("../controllers/FulfillmentModule/getOptions");
const postDeliveryOptionsController = require("../controllers/FulfillmentModule/postDeliveryOption");
const postPickupOptionController = require("../controllers/FulfillmentModule/postPickupOption");
const deletePickupOptionsController = require("../controllers/FulfillmentModule/deletePickupOption");
const deleteDeliveryOptionController = require("../controllers/FulfillmentModule/deleteDeliveryOption");

//import middlewares
const { validateUser } = require("../middlewares/authenticateUserProps");
//import validators
const createDeliveryOptionValidator = require("../validators/FulfillmentValidators/createDeliveryOptionValidator");
const createPickupOptionValidator = require("../validators/FulfillmentValidators/createPickupOtionValidator");
/**
 * @swagger
 * tags:
 *  name: Fullfillment
 *  description: The fullfillment managing APIS
 * */
/**
 * @swagger
 * /v1/fulfillment/pickup/{id}:
 *  delete:
 *      tags:
 *          - Fullfillment
 *      summary: API for deleting a pickup option
 *      parameters:
 *        - in: header
 *          name: auth-token
 *          type: string
 *          description: Ex -> Bearer {token}
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID of the pickup options
 *          schema:
 *              type: string
 *      responses:
 *          '200':
 *              description: Removed successfully
 *
 * */
fulfillmentRouter.delete(
  "/pickup/:id",
  validateUser,
  deletePickupOptionsController
);
/**
 * @swagger
 * /v1/fulfillment/delivery/{id}:
 *  delete:
 *      tags:
 *          - Fullfillment
 *      summary: API for deleting a delivery option
 *      parameters:
 *        - in: header
 *          name: auth-token
 *          type: string
 *          description: Ex -> Bearer {token}
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID of the delivery option
 *          schema:
 *              type: string
 *      responses:
 *          '200':
 *              description: Removed successfully
 *
 * */
fulfillmentRouter.delete(
  "/delivery/:id",
  validateUser,
  deleteDeliveryOptionController
);
/**
 * @swagger
 * /v1/fulfillment/pickup:
 *  post:
 *      tags:
 *          - Fullfillment
 *      summary: API for creating new pickup option
 *      parameters:
 *        - in: header
 *          name: auth-token
 *          required: true
 *          type: string
 *          description: Ex -> Bearer {token}
 *      requestBody:
 *          content:
 *             raw/json:
 *              schema:
 *                  type: object
 *                  required:
 *                      - title
 *                      - price
 *                      - description
 *                  properties:
 *                      title:
 *                          required: true
 *                          type: string
 *                          description: Name of the pickup option
 *                      price:
 *                          required: true
 *                          type: string
 *                          description: Price of the pickup option
 *                      description:
 *                          required: false
 *                          type: string
 *                          description: Description of the pickup option
 *                      cityName:
 *                          required: false
 *                          type: string
 *                          description: City Name of the delivery option
 *      responses:
 *          '200':
 *              description: Request process successfully
 *              content:
 *                application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                        data:
 *                           type: object
 *                           properties:
 *                              message:
 *                                type: string
 *                              option:
 *                                type: object
 *                                properties:
 *                                    id:
 *                                      type: string
 *                                    title:
 *                                      type: string
 *                                    price:
 *                                      type: string
 *                                    shopId:
 *                                      type: string
 *                                    currencyCode:
 *                                      type: string
 *                                    description:
 *                                      type: string
 * */
fulfillmentRouter.post(
  "/pickup",
  createPickupOptionValidator,
  validateUser,
  postPickupOptionController
);
/**
 * @swagger
 * /v1/fulfillment/delivery:
 *  post:
 *      tags:
 *          - Fullfillment
 *      summary: API for creating new delivery option
 *      parameters:
 *        - in: header
 *          name: auth-token
 *          required: true
 *          type: string
 *          description: Ex -> Bearer {token}
 *      requestBody:
 *          content:
 *             raw/json:
 *              schema:
 *                  type: object
 *                  required:
 *                      - title
 *                      - price
 *                      - description
 *                  properties:
 *                      title:
 *                          required: true
 *                          type: string
 *                          description: Name of the delivery option
 *                      price:
 *                          required: true
 *                          type: string
 *                          description: Price of the delivery option
 *                      description:
 *                          required: false
 *                          type: string
 *                          description: Description of the delivery option
 *                      cityName:
 *                          required: false
 *                          type: string
 *                          description: City Name of the delivery option
 *      responses:
 *          '200':
 *              description: Request process successfully
 *              content:
 *                application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                        data:
 *                           type: object
 *                           properties:
 *                              message:
 *                                type: string
 *                              option:
 *                                type: object
 *                                properties:
 *                                    id:
 *                                      type: string
 *                                    title:
 *                                      type: string
 *                                    price:
 *                                      type: string
 *                                    shopId:
 *                                      type: string
 *                                    currencyCode:
 *                                      type: string
 *                                    description:
 *                                      type: string
 *                                    serverResponse:
 *                                      type: string
 * */
fulfillmentRouter.post(
  "/delivery",
  createDeliveryOptionValidator,
  validateUser,
  postDeliveryOptionsController
);
/**
 * @swagger
 * /v1/fulfillment:
 *  get:
 *      tags:
 *          - Fullfillment
 *      summary: API for getting all pickup and delivery options
 *      parameters:
 *        - in: header
 *          name: auth-token
 *          required: true
 *          type: string
 *          description: Ex -> Bearer {token}
 *      responses:
 *          '200':
 *              description: Request processed successfully
 *              content:
 *                application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                        data:
 *                           type: object
 *                           properties:
 *                              message:
 *                                type: string
 *                              options:
 *                                type: object
 *                                properties:
 *                                   pickupOtions:
 *                                        type: array
 *                                        items:
 *                                            type: object
 *                                            properties:
 *                                                id:
 *                                                  type: string
 *                                                shopId:
 *                                                  type: string
 *                                                title:
 *                                                  type: string
 *                                                currencyCode:
 *                                                  type: string
 *                                                price:
 *                                                  type: string
 *                                                description:
 *                                                  type: string
 *                                   deliveryOptions:
 *                                        type: array
 *                                        items:
 *                                            type: object
 *                                            properties:
 *                                                id:
 *                                                  type: string
 *                                                shopId:
 *                                                  type: string
 *                                                title:
 *                                                  type: string
 *                                                currencyCode:
 *                                                  type: string
 *                                                price:
 *                                                  type: string
 *                                                description:
 *                                                  type: string
 *                                                serverResponse:
 *                                                  type: string
 * 
 * */
fulfillmentRouter.get("/", validateUser, getFulFillmentOptionsController);

module.exports = fulfillmentRouter;
