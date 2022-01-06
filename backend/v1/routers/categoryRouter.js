const categoryRouter = require("express").Router();
const { validateUser } = require("../middlewares/authenticateUserProps");
const postCategoryController = require("../controllers/CategoryModule/postCategroy");
const deleteCategoryController = require("../controllers/CategoryModule/deleteCategory");
const putCategoryController = require("../controllers/CategoryModule/putCategory");
const getCategoryController = require("../controllers/CategoryModule/getCategory");
const getCategoriesController = require("../controllers/CategoryModule/getCategories");

const newCategoryValidator = require("../validators/CategoryValidators/newCategoryValidator");
const updateCategoryValidator = require("../validators/CategoryValidators/updateCategoryValidator");

/**
 * @swagger
 * tags:
 *  name: Category
 *  description: The Category managing APIS
 * */

/**
 * @swagger
 * /v1/category:
 *  post:
 *      tags:
 *          - Category
 *      summary: API for creating new category
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
 *                      - name
 *                  properties:
 *                      name:
 *                          required: true
 *                          type: string
 *                          description: Name of the category
 *                      image:
 *                          required: false
 *                          type: file
 *                          description: Image of the category
 *              encoding:
 *                  image:
 *                      contentType: image/*
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
 *                              id:
 *                                type: string
 *                              name:
 *                                 type: string
 *                              slug:
 *                                type: string
 *                              image:
 *                                type: string
 *                              shopId:
 *                                type: string
 *                              createdAt:
 *                                type: string
 *                              updatedAt:
 *                                type: string
 * */

categoryRouter.post(
  "/",
  validateUser,
  newCategoryValidator,
  postCategoryController
);
/**
 * @swagger
 * /v1/category/{id}:
 *  delete:
 *      tags:
 *          - Category
 *      summary: API for deleting the Category
 *      parameters:
 *        - in: header
 *          name: auth-token
 *          type: string
 *          description: Ex -> Bearer {token}
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID of the category
 *          schema:
 *              type: string
 *      responses:
 *          '200':
 *              description: Removed successfully
 *
 * */
categoryRouter.delete("/:id", validateUser, deleteCategoryController);

/**
 * @swagger
 * /v1/category/{id}:
 *  put:
 *      tags:
 *          - Category
 *      summary: API for updating the Category
 *      parameters:
 *        - in: header
 *          name: auth-token
 *          type: string
 *          description: Ex -> Bearer {token}
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID of the category
 *          schema:
 *              type: string
 *      requestBody:
 *          content:
 *             multipart/form-data:
 *              schema:
 *                  type: object
 *                  properties:
 *                      name:
 *                          required: false
 *                          type: string
 *                          description: Name of the category
 *                      image:
 *                          required: false
 *                          type: file
 *                          description: Image of the category
 *              encoding:
 *                  image:
 *                      contentType: image/*
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
 *                              id:
 *                                type: string
 *                              name:
 *                                 type: string
 *                              slug:
 *                                type: string
 *                              image:
 *                                type: string
 *                              shopId:
 *                                type: string
 *                              createdAt:
 *                                type: string
 *                              updatedAt:
 *                                type: string
 *
 *
 * */
categoryRouter.put(
  "/:id",
  validateUser,
  updateCategoryValidator,
  putCategoryController
);
/**
 * @swagger
 * /v1/category/{id}:
 *  get:
 *      tags:
 *          - Category
 *      summary: API for getting details about a specific category
 *      parameters:
 *        - in: header
 *          name: auth-token
 *          type: string
 *          description: Ex -> Bearer {token}
 *        - in: path
 *          name: id
 *          type: string
 *          description: ID of the category
 *      responses:
 *          '200':
 *              description: Request process successfully
 *              content:
 *                application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                        data:
 *                              type: object
 *                              properties:
 *                                id:
 *                                  type: string
 *                                name:
 *                                  type: string
 *                                slug:
 *                                  type: string
 *                                image:
 *                                  type: string
 *                                shopId:
 *                                  type: string
 *                                createdAt:
 *                                  type: string
 *                                updatedAt:
 *                                  type: string
 *                                products:
 *                                  type: array
 *                                  items:
 *                                      type: object
 *                                      properties:
 *                                          id:
 *                                            type: string
 *                                          name:
 *                                            type: string
 *                                          stock:
 *                                            type: number
 *                                          status:
 *                                            type: number
 *                                          slug:
 *                                            type: string
 *                                          shopId:
 *                                            type: string
 *                                          price:
 *                                            type: string
 *                                          parentId:
 *                                            type: string
 *                                          createdAt:
 *                                            type: string
 *                                          updatedAt:
 *                                            type: string
 *
 * */
categoryRouter.get("/:id", validateUser, getCategoryController);
/**
 * @swagger
 * /v1/category:
 *  get:
 *      tags:
 *          - Category
 *      summary: API for getting details about the categories
 *      parameters:
 *        - in: header
 *          name: auth-token
 *          type: string
 *          description: Ex -> Bearer {token}
 *      responses:
 *          '200':
 *              description: Request process successfully
 *              content:
 *                application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                        data:
 *                           type: array
 *                           items:
 *                              type: object
 *                              properties:
 *                                id:
 *                                  type: string
 *                                name:
 *                                  type: string
 *                                slug:
 *                                  type: string
 *                                image:
 *                                  type: string
 *                                shopId:
 *                                  type: string
 *                                createdAt:
 *                                  type: string
 *                                updatedAt:
 *                                  type: string
 *                                products:
 *                                  type: array
 *                                  items:
 *                                      type: object
 *                                      properties:
 *                                          id:
 *                                            type: string
 *                                          name:
 *                                            type: string
 *                                          stock:
 *                                            type: number
 *                                          status:
 *                                            type: number
 *                                          slug:
 *                                            type: string
 *                                          shopId:
 *                                            type: string
 *                                          price:
 *                                            type: string
 *                                          parentId:
 *                                            type: string
 *                                          createdAt:
 *                                            type: string
 *                                          updatedAt:
 *                                            type: string
 *
 * */
categoryRouter.get("/", validateUser, getCategoriesController);

//categoryRouter.use("/category", categoryRouter);
module.exports = categoryRouter;
