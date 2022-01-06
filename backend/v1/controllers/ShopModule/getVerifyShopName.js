const { Shop } = require("../../../db/models");

module.exports = async (req, res) => {
  const name = req.params.shopName;
  try {
    const data = await Shop.findOne({
      where: {
        name
      },
    });
    if (data === null) {
        let success = {
            status_code: 200,
            message: "Shop Name is valid",
          };
        return apiResponse.success(res, success);
    }
    else{
        return apiResponse.error(res, 400, "Shop Name already taken!");
    }
  } catch (error) {
    console.log(error);
    return apiResponse.errorWithData(res, error, 400);
  }
};

