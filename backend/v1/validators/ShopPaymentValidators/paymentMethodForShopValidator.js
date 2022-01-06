const Validator = require('validatorjs')
const { PaymentMethod } = require("../../../db/models")


module.exports  = async (req, res, next) => {

    const rules = {
        paymentMethodsId: "required",
        accountDetail: "required|min:1|max:250",
    };

    const validator = new Validator(req.body, rules);

    if(validator.fails()){
        return apiResponse.errorWithData(res, validator.errors, 422);
    }else if(validator.passes()){
        try{
            const paymentMethod = await PaymentMethod.findByPk(
                req.body.paymentMethodsId
            )

            if(paymentMethod){
                return next()
            }else{
                return apiResponse.error(res, 404, 'Payment Method not found!')
            }
        }catch (e) {
            return apiResponse.error(res)
        }

    }

}