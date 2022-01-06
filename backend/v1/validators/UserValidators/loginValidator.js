const Validator = require('validatorjs')



module.exports = (req, res, next) => {
    let rules = {
        email: "required|email",
        password: "required|min:8",
    };

    const customMessage = {
        'required.email': ':attribute is required!',
        'email.email': 'Email is not valid!',
        'min.password': 'Minimum 8 character length!'
    }

    const validator = new Validator(req.body, rules, customMessage)

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