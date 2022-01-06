const Validator = require('validatorjs')



module.exports = (req, res, next) => {
    let rules = {
        title: "required|string|min:5|max:50",
        currencyCode: "string",
        price: "required|string|min:1|max:100",
        description: "required|string",
        cityName: "string"
    };

    const validator = new Validator(req.body, rules);

    if (validator.fails()) {
        return apiResponse.errorWithData(
            res,
            validator.errors.all(),
            422,
            "Validation Error"
        );
    }
    return next();

}