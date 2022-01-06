const jwt = require('jsonwebtoken');

const generateJWT = ( userData ) => {
    return new Promise( (resolve, reject) => {
        
     
        jwt.sign(userData, process.env.JWT_SECRETKEY, {
            expiresIn: '30d'
        }, (error, token) => {
            if(error){
                console.log(error);
                reject('Token could not be generated');
            }
            else{
                resolve(token);
            }
        })
    });
}

module.exports = {
    generateJWT
}