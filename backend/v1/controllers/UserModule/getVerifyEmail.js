const { User } = require("../../../db/models");

module.exports = async (req, res) => {
  const email = req.params.email;
  try {
    const data = await User.findOne({
      where: {
        email
      },
    });
    if (data === null) {
        let success = {
            status_code: 200,
            message: "Email is valid",
          };
        return apiResponse.success(res, success);
    }
    else{
        return apiResponse.error(res, 400, "Email already taken!");
    }
  } catch (error) {
    console.log(error);
    return apiResponse.errorWithData(res, error, 400);
  }
};

