const Validator = require('validatorjs')



module.exports = (req, res, next) => {
    let rules = {
        //email: "email",
        fullName: "string|min:3|max:25",
        oldPassword: "string|min:8",
        newPassword: "string|min:8",

    };
    const validator = new Validator(req.body, rules)

    if (validator.fails()) {
        return apiResponse.errorWithData(
            res,
            validator.errors.all(),
            422,
            "Validation Error"
        );
    }else{
        //if new password field exists then old password field must exists
        if("newPassword" in req.body){
            let oldPasswordExits = "oldPassword" in req.body;
            if(!oldPasswordExits){
                return apiResponse.error(res, 400, "Must include 'oldPassword' field");
            }
        }
    }
    return next();
}