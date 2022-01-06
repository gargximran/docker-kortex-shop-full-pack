const { Shop } = require("../../../db/models");

module.exports = async (req, res) => {
  const slug = req.params.slug + "";
  if(slug.length < 3 || slug.length > 100){
    return apiResponse.error(res, 400, "Shop slug must be 3 to 100 characters long!");
  }
  if(! /^[a-zA-Z0-9_-]+$/.test(slug)){
    return apiResponse.error(res, 400, "Slug must contain alphanumeric letters and no whitespace!");
  }
  try {
    const data = await Shop.findOne({
      where: {
        slug
      },
    });
    if (data === null) {
        let success = {
            status_code: 200,
            message: "Shop slug is valid",
          };
        return apiResponse.success(res, success);
    }
    else{
        return apiResponse.error(res, 400, "Shop slug already taken!");
    }
  } catch (error) {
    console.log(error);
    return apiResponse.errorWithData(res, error, 400);
  }
};

