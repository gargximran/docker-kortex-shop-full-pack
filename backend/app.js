const serverless = require('serverless-http');
const express = require('express')
const app = express();
const router = express.Router();
const cors = require('cors');
// // import versioned app
const appV1 = require('./v1')

router.use(appV1)
app.use(cors())
app.use(router)

app.get("/", (req, res) => {
    res.send('hello world!')
})
app.listen(5000, () => console.log(`🚀 Server is listening on port: 5000 🚀`));
//module.exports.handler = serverless(app);