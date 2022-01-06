const { nanoid } = require('nanoid');
module.exports = async (text, model, shopId) => {
    let unique = false;
    let slug = text.split(' ').join('-');
    let withSuffixSlug = slug;

    const query = (text) => shopId ? {slug: text, shopId: shopId} : {slug: text}

    while(!unique){
        let data = await model.findOne({
            where: query(withSuffixSlug)
        })
        if(data){
            withSuffixSlug = slug + '-' + nanoid(7);

        }else{
            unique = true
        }
    }

    return withSuffixSlug


}
