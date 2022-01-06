const Validator = require('validatorjs')

module.exports = (req, res, next) => {
    //console.log(req.body)
    let rules = {
        productName: "required|string|min:4|max:30",
        hasVariant: "required|boolean",
        productPrice: "string",
        productDescription: "string"
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
    else{
        //pass empty arrays for the category
        let categoriesArr = req.body.categories;
        if(!Array.isArray(categoriesArr)){
            return apiResponse.error(res, 400, 'categories property must be an array.');
        }
        req.body.categories = categoriesArr;
        categoriesArr.forEach((item) => {
            if(typeof item !== 'string' || item.length !== 36){
                return apiResponse.error(res, 400, 'categories array must be a collection of strings and each item must be a UUID');
            }
        });
        req.body.categories = categoriesArr;
        let hasVariant = req.body.hasVariant;
        req.body.hasVariant = hasVariant;
        //if it doesn't have variant then it must include the product price
        if(hasVariant){
            //product price should be null
            req.body.productPrice = null;
            
            let variantImageExists = "variantImage" in req.files;
            if(!variantImageExists){
                req.files.variantImage = [];
            }
            let variantNameExists = "variantName" in req.body;
            if(!variantNameExists){
                return apiResponse.error(res, 400, "Must have the variantName property!");
            }
            let variantPriceExists = "variantPrice" in req.body;
            if(!variantPriceExists){
                return apiResponse.error(res, 400, "Must have the variantPrice property!");
            }
            //check if variant image in singular form or not..if it is make it an array;
            if(!Array.isArray(req.files.variantImage)){
                req.files.variantImage = [req.files.variantImage]
            }
            //check if variant price and variant Name is array or not
            let variantNameArr = req.body.variantName;
            if(!Array.isArray(variantNameArr)){
                return apiResponse.error(res, 400, "format of the variantName is not correct!");
            }
            let variantPriceArr = req.body.variantPrice;
            if(!Array.isArray(variantPriceArr)){
                return apiResponse.error(res, 400, "format of the variantPrice is not correct!");
            }
            let variantDescriptionArr = req.body.variantDescription;
            if(!Array.isArray(variantDescriptionArr)){
                return apiResponse.error(res, 400, "format of the variantDescription is not correct!");
            }
            let variantImageArr = req.body.variantImage;
            if(!Array.isArray(variantImageArr)){
                return apiResponse.error(res, 400, "format of the variantImage is not correct!");
            }
            //check if the length of three of the arrays are same;
            let areLengthsValid = variantNameArr.length === variantPriceArr.length
            if(!areLengthsValid){
                return apiResponse.error(res, 400, "Length of the variantName and variantPrice array are not same!");
            }
            req.body.variantPrice = variantPriceArr;
            req.body.variantName = variantNameArr;

        }else{
            let productPrice = req.body.productPrice;
            if(!productPrice){
                return apiResponse.error(res, 400, "Must include the price of the product!");
            }
        }
    }
    return next();
}