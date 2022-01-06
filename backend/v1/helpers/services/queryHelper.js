const { Op } = require("sequelize")

module.exports = queryHelper = {
    getAll: async(Model) => {
        let result = await Model.findAll({
            where: {
                deletedAt: {
                    [Op.is] : null
                }
            }
        });

        return result;
    },


    checkById : async(Model, id) => {
        let result = await Model.findOne({
            where: {
                id,
                deletedAt: {
                    [Op.is] : null
                }
            }
        });

        return result;
    },

    // checkByParam : async(Model, key, data) => {
    //     let result = await Model.findOne({
    //         where: {
    //             key: data,
    //             deletedAt: {
    //                 [Op.is] : null
    //             }
    //         }
    //     });

    //     return result;
    // }
}