const { ShopPaymentMethod } = require('../../../db/models')
const { Op } = require('sequelize')

module.exports = async (req, res) => {

    try{
        const shopId = req.user.shop.id

        const { paymentMethodsId, accountDetail } = req.body;
        const method = await ShopPaymentMethod.findOne({
            where: {
                [Op.and]: [
                    {shopId},
                    {paymentMethodsId}
                ]
            }
        })

        if(method){
            const updatedMethod = await method.update({
                accountDetail
            })

            return apiResponse.success(res, updatedMethod, 201, 'Payment method detail updated!')
        }else{
            const newPaymentMethod = await ShopPaymentMethod.create({
                shopId,
                paymentMethodsId,
                accountDetail,
                isVerified: true
            })



            return apiResponse.success(res, newPaymentMethod, 200, 'Payment method added successfully!')
        }


    }catch (e) {
        console.log(e)
        return apiResponse.error(res)
    }

}