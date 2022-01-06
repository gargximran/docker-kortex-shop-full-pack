const { ShopPaymentMethod } = require('../../../db/models')
const { Op } = require('sequelize')


module.exports = async (req, res) => {
    const { id } = req.params;
    const shopId = req.user.shop.id;

    try{
        const paymentMethod = await ShopPaymentMethod.findOne({
            where: {
                [Op.and] : [
                    {shopId},
                    {id: id}
                ]
            }
        })

        if(paymentMethod){
            await paymentMethod.destroy()
            return apiResponse.success(res, {}, 200, 'Payment method deleted!')
        }else{
            return res.status(404).send()
        }
    }catch (e) {
        console.log(e)
        return apiResponse.error(res)
    }

}