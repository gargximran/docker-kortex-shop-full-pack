const Validator = require("validatorjs");

module.exports = (req, res, next) => {
  let rules = {
    dates: "required",
  };

  const validator = new Validator(req.body, rules);

  if (validator.fails()) {
    return apiResponse.errorWithData(
      res,
      validator.errors.all(),
      422,
      "Validation Error"
    );
  } else {
    //pass empty arrays for the category
    let datesArr = req.body.dates;
    if (!Array.isArray(datesArr)) {
      return apiResponse.error(
        res,
        400,
        "Dates property must be an array of dates"
      );
    }
    if (datesArr.length === 0) {
      return apiResponse.error(res, 400, "Array length can not be zero");
    }
    for (let i = 0; i < datesArr.length; i++) {
      let parsed = new Date(datesArr[i]);
      if (parsed.toString() === "Invalid Date") {
        return apiResponse.error(
          res,
          400,
          `${datesArr[i]} is not a valid date`
        );
      }
    }
  }
  return next();
};
