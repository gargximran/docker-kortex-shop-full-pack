const { Availability } = require("../../../db/models");
const { Op } = require("sequelize");

module.exports = async (req, res) => {
  console.log(req.body.dates);
  const { dates: datesArray } = req.body;
  //sort the array
  const today = new Date();
  const dates = datesArray
    .filter((el) => new Date(el) > today)
    .sort((d1, d2) => (new Date(d1) > new Date(d2) ? 1 : -1));
  console.log(dates)
  //let minDate = dates[0];
  //let maxDate = dates[dates.length - 1];
  const { id: userId, shop: shopData } = req.user;
  try {
    if (!shopData) {
      return apiResponse.error(res, 404, "Shop doesn't exist!");
    }
    if (shopData.userId !== userId) {
      return apiResponse.error(res, 401, "Not authenticated!");
    }
    const entriesToPush = dates.map((obj) => ({
      shopId: shopData.id,
      //date: new Date(obj),
      date: obj
    }));
    //destroy previous availabilities between this time range
    await Availability.destroy({
      where: {
        shopId: shopData.id,
        date: {
          //[Op.between]: [minDate, maxDate],
          [Op.gte]: today
        },
      },
    });
    //console.log("Entries to push :", entriesToPush);
    const insertedData = await Availability.bulkCreate(entriesToPush);
    let object = {
      message: "Data inserted successfully",
      dates: insertedData,
    };
    return apiResponse.success(res, object);
  } catch (error) {
    console.log(error);
    return apiResponse.error(res, 500, error);
  }
};
