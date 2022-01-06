const Validator = require('validatorjs')



module.exports = (req, res, next) => {
    let rules = {
        name: "required|string|min:2|max:14",
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