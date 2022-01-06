const express = require("express");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const { options } = require("./helpers/swaggerCongif");

const appV1 = express();
const bodyParser = require("./middlewares/bodyParser");
require("./helpers/apiResponse");
const router = express.Router();

const { extractJWT } = require("./middlewares/extractJWTIfAny");

// init swagger
const specs = swaggerJsDoc(options);

// import all router here
const userRouter = require("./routers/userRouter");
const shopRouter = require("./routers/shopRouter");
const categoryRouter = require("./routers/categoryRouter");
const utilsRouter = require('./routers/utilsRouter')
const availabilityRouter = require('./routers/availabilityRouter');
const fulfillmentRouter = require('./routers/fulfillmentRouter');
const productRouter = require('./routers/productRouter');

// register all route here
router.use('/user',userRouter);
router.use('/shop',shopRouter);
router.use('/category',categoryRouter);
router.use('/utils', utilsRouter);
router.use('/availability', availabilityRouter);
router.use('/fulfillment', fulfillmentRouter );
router.use('/product', productRouter);

router.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

appV1.use(bodyParser);
appV1.use(extractJWT);
// add prefix for versioning
appV1.use("/v1", router);

module.exports = appV1;
