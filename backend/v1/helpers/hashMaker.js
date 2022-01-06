const bcrypt = require('bcrypt')


module.exports = async (data) => {
    try{
        const hashPw = await bcrypt.hash(data + new Date().toLocaleDateString(), 10)
        return hashPw
    }catch (e) {
        console.log(e)
        return 
    }

}