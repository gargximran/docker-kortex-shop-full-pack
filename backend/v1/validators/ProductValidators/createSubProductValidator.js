const Validator = require('validatorjs')

module.exports = (req, res, next) => {
    let rules = {
        productName: "required|string|min:4|max:15",
        productPrice: "required|string",
        categoryId: "string|min:36",
        parentId: "required|string|min:36"
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