/**
 * @file jwt.utils
 * @author EclipsioZ
 * @license GPL-3.0
 */

 // Importation de la librairie jwt
var jwt = require('jsonwebtoken');

const JWT_SIGN_SECRET = '0e56trtasief52j48k4u8k1gd1f8x2ds4f48etfh2f1h215s41sdsdsr451s212'

module.exports = {
    generateTokenForUser: function(userData) {
        console.log(userData.id_Rank);
        return jwt.sign({
            userId: userData.id,
            userRank: userData.id_Rank
        },
        JWT_SIGN_SECRET,
        {
            expiresIn: '6h'
        })
    }
}