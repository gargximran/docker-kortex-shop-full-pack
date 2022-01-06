const utilsRouter = require('express').Router();

// controllers
const getAllPaymentMethodsName = require('../controllers/UtilsModule/getAllPaymentMehodsName')

// authenticate guard
const { validateUser } = require('../middlewares/authenticateUserProps')




/**
 * @swagger
 * tags:
 *  name: Utils
 *  description: All utility management APIs
 *
 * */


/**
 * @swagger
 * /v1/utils/payment-methods:
 *
 *  get:
 *      tags:
 *          - Utils
 *      summary: Return all payment methods for seller
 *      parameters:
 *          - in: header
 *            name: auth-token
 *            required: true
 *      responses:
 *          401:
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              success:
 *                                  type: boolean(false)
 *                              status_code:
 *                                  type: 401
 *                              message:
 *                                  type: string not authorized!
 *          200:
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              success:
 *                                  type: boolean
 *                              status_code:
 *                                  type: integer
 *                              message:
 *                                  type: string
 *                              data:
 *                                  type: array
 *                                  items:
 *                                      type: object
 *                                      properties:
 *                                          id:
 *                                              type: UUID
 *                                          name:
 *                                              type: string
 *                                          icon:
 *                                              type: string
 *                                          createdAt:
 *                                              type: string
 *                                          updatedAt:
 *                                              type: string
 *
 *
 *
 * */
utilsRouter.get('/payment-methods', validateUser, getAllPaymentMethodsName)



module.exports = utilsRouter