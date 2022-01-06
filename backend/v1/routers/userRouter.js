const userRouter = require("express").Router();
const forgotPasswordController = require("../controllers/UserModule/putForgotPassword");
const verifyTokenController = require("../controllers/UserModule/getVerifyUserToken");
const verifyAccountController = require("../controllers/UserModule/putVerifyAccount");
const changePasswordController = require("../controllers/UserModule/putChangePassword");
const regenerateVerificationTokenController = require("../controllers/UserModule/putRegenerateVerifyAccountToken");
const loginController = require("../controllers/UserModule/postLogin");
const putUpdateUserController = require("../controllers/UserModule/putUpdateUserInfo");
const getVerifyEmailController = require("../controllers/UserModule/getVerifyEmail");
const getVerifyJWTController = require("../controllers/UserModule/getVerifyJWTToken");
// import validators
const loginValidator = require("../validators/UserValidators/loginValidator");
const updateUserValidator = require("../validators/UserValidators/updateUserValidator");

//import middlewares
const { validateUser } = require("../middlewares/authenticateUserProps");

/**
 * @swagger
 * tags:
 *  name: User
 *  description: The user managing APIS
 * */

userRouter.put("/forgot-password", forgotPasswordController);
/**
 * @swagger
 * /v1/user/verify-token/{token}:
 *  get:
 *      tags:
 *          - User
 *      summary: Verify a token
 *      parameters:
 *        - in: path
 *          name: token
 *          required: true
 *          type: string
 *          description: Enter the token
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
 *                          data:
 *                               type: object
 *                               properties:
 *                                    status_code:
 *                                          type: number
 *                                          default: 200
 *                                    message:
 *                                          type: string
 * */
userRouter.get("/verify-token/:token", verifyTokenController);
/**
 * @swagger
 * /v1/user/verify-account/{token}:
 *  put:
 *      tags:
 *          - User
 *      summary: Verify account with token
 *      parameters:
 *        - in: path
 *          name: token
 *          required: true
 *          type: string
 *          description: Enter the token
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
 *                          data:
 *                               type: object
 *                               properties:
 *                                    status_code:
 *                                          type: number
 *                                          default: 200
 *                                    message:
 *                                          type: string
 * */
userRouter.put("/verify-account/:token", verifyAccountController);
/**
 * @swagger
 * /v1/user/change-password/{token}:
 *  put:
 *      tags:
 *          - User
 *      summary: Change password with token
 *      parameters:
 *        - in: path
 *          name: token
 *          required: true
 *          type: string
 *          description: Enter the token
 *      requestBody:
 *          content:
 *             multipart/form-data:
 *              schema:
 *                  type: object
 *                  required:
 *                      - password
 *                  properties:
 *                      password:
 *                          required: true
 *                          type: string
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
 *                          data:
 *                               type: object
 *                               properties:
 *                                    status_code:
 *                                          type: number
 *                                          default: 200
 *                                    message:
 *                                          type: string
 * */
userRouter.put("/change-password/:token", changePasswordController);
/**
 * @swagger
 * /v1/user/get-verification-token:
 *  put:
 *      tags:
 *          - User
 *      summary: Get a verification a token
 *      requestBody:
 *          content:
 *             multipart/form-data:
 *              schema:
 *                  type: object
 *                  required:
 *                      - email
 *                  properties:
 *                      email:
 *                          required: true
 *                          type: string
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
 *                          data:
 *                               type: object
 *                               properties:
 *                                    status_code:
 *                                          type: number
 *                                          default: 200
 *                                    message:
 *                                          type: string
 *
 *
 * */
userRouter.put(
  "/get-verification-token",
  regenerateVerificationTokenController
);
/**
 * @swagger
 * /v1/user/login:
 *  post:
 *      tags:
 *          - User
 *      summary: Login User
 *      requestBody:
 *          content:
 *             multipart/form-data:
 *              schema:
 *                  type: object
 *                  required:
 *                      - email
 *                      - password
 *                  properties:
 *                      email:
 *                          required: true
 *                          type: string
 *                          minLength: 1
 *                      password:
 *                          required: true
 *                          type: string
 *                          minLength: 8
 *                          description: Password for the account (minimum - 8)
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
userRouter.post("/login", loginValidator, loginController);
/**
 * @swagger
 * /v1/user/update:
 *  put:
 *      tags:
 *          - User
 *      summary: Update User info
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
 *                  properties:
 *                      fullName:
 *                          type: string
 *                          minLength: 2
 *                          maxLength: 25
 *                          description: Updated Name
 *                      newPassword:
 *                          type: string
 *                          minLength: 8
 *                          description: Password for the account (minimum - 8)
 *                      oldPassword:
 *                          type: string
 *                          minLength: 8
 *                          description: Required if new password is passed
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
 *                                  default: User info update successful
 *                               data:
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
userRouter.put(
  "/update",
  updateUserValidator,
  validateUser,
  putUpdateUserController
);
/**
 * @swagger
 * /v1/user/check-email/{email}:
 *  get:
 *      tags:
 *          - User
 *      summary: Check if the email exists or not
 *      parameters:
 *        - in: path
 *          name: email
 *          required: true
 *          type: string
 *          description: email to check
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
 *                           default: Email already taken
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
 *                                  default: Email is valid
 *
 *
 * */
userRouter.get("/check-email/:email", getVerifyEmailController);
/**
 * @swagger
 * /v1/user/verify-jwt:
 *  get:
 *      tags:
 *          - User
 *      summary: API for validating the jwt
 *      parameters:
 *        - in: header
 *          name: auth-token
 *          type: string
 *          description: Ex -> Bearer {token}
 *      responses:
 *          '200':
 *              description: Token is valid
 *          '401':
 *              description: Token is not valid
 *
 * */
userRouter.get("/verify-jwt", getVerifyJWTController);
module.exports = userRouter;
