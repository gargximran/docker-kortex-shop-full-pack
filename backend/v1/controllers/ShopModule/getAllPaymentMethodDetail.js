const { ShopPaymentMethod } = require('../../../db/models')


module.exports = async (req, res) => {
    const shopId = req.user.shop.id;

    try{
        const paymentMethods = await ShopPaymentMethod.findAll({
            attributes: [
                'id',
                'paymentMethodsId',
                'accountDetail',
                'isVerified',
            ],
            where: {
                shopId
            },
            include: {
                association: 'payment_method',
                attributes: ['icon', 'name']
            }
        })

        return apiResponse.success(res, paymentMethods, 200)


    }catch (e) {
        return apiResponse.error(res)
    }

}