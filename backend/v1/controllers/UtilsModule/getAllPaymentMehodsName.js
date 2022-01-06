const { PaymentMethod } = require('../../../db/models')
const { getAll } = require('../../helpers/services/queryHelper')


module.exports = async (req, res) => {
    try{
        const methods = await getAll(PaymentMethod);
        return apiResponse.success(res, methods, 200,)
    }catch (e) {
        return apiResponse.error(res)
    }
}