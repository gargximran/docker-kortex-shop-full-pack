const Validator = require('validatorjs')

module.exports = (req, res, next) => {
    let rules = {
        name: "string|min:4|max:30",
        price: "string",
        stock: "integer",
        status: "boolean",
    };

    const validator = new Validator(req.body, rules)

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