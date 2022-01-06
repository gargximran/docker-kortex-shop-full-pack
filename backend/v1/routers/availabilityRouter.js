const availabilityRouter = require("express").Router();
//import controllers
const putAvailabilitiesController = require("../controllers/AvailabilityModule/putAvailabilities");
const getAvailabilitiesController = require("../controllers/AvailabilityModule/getAvailabities");

//import middlewares
const { validateUser } = require("../middlewares/authenticateUserProps");
//import validators
const putAvailabilitiesValidator = require("../validators/AvailabiltyValidators/putAvailabilitiesValidator");
/**
 * @swagger
 * tags:
 *  name: Availability
 *  description: The shop-availability managing APIS
 * */
/**
 * @swagger
 * /v1/availability:
 *  put:
 *      tags:
 *          - Availability
 *      summary: Update availability dates of user's shop
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
 *                  properties:
 *                      dates:
 *                          required: true
 *                          type: array
 *                          items:
 *                               type: string
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
 *                           default: 400
 *                        message:
 *                           type: string
 *                           default: The email or password are incorrect
 *          '404':
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
 *                           default: User not found with specific id
  *          '200':
 *              description: Request process successfully
 *              content:
 *                application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          status_code:
 *                               type: number
 *                               default: 200
 *                          message:
 *                               type: string
 *                          success:
 *                               type: boolean
 *                               default: true
 *                          data:
 *                               type: object
 *                               properties:
 *                                    message:
 *                                          type: string
 *                                          default: Data inserted successfully
 *                                    dates:
 *                                          type: array
 *                                          items:
 *                                              type: object
 *                                              properties:
 *                                                   shopId:
 *                                                      type: string 
 *                                                   date:
 *                                                      type: string
 *                                                   id:
 *                                                      type: string 
 *                                                   createdAt:
 *                                                      type: string
 *                                                   updatedAt:
 *                                                      type: string 
 *                                                                                 
 * */
availabilityRouter.put("/", putAvailabilitiesValidator,validateUser, putAvailabilitiesController);

/**
 * @swagger
 * /v1/availability:
 *  get:
 *      tags:
 *          - Availability
 *      summary: get availability dates of user's shop
  *      parameters:
 *        - in: header
 *          name: auth-token
 *          required: true
 *          type: string
 *          description: Ex -> Bearer {token}
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
 *                           default: 400
 *                        message:
 *                           type: string
 *                           default: The email or password are incorrect
 *          '404':
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
 *                           default: User not found with specific id
  *          '200':
 *              description: Request process successfully
 *              content:
 *                application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          status_code:
 *                               type: number
 *                               default: 200
 *                          message:
 *                               type: string
 *                          success:
 *                               type: boolean
 *                               default: true
 *                          data:
 *                               type: object
 *                               properties:
 *                                    message:
 *                                          type: string
 *                                    dates:
 *                                          type: array
 *                                          items:
 *                                              type: object
 *                                              properties:
 *                                                   shopId:
 *                                                      type: string 
 *                                                   date:
 *                                                      type: string
 *                                                   id:
 *                                                      type: string 
 *                                                   createdAt:
 *                                                      type: string
 *                                                   updatedAt:
 *                                                      type: string 
 *                                                                                 
 * */
availabilityRouter.get("/", validateUser, getAvailabilitiesController);

module.exports = availabilityRouter;
