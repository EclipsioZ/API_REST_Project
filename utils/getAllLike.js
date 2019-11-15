/**
 * @file getAllLike
 * @author EclipsioZ
 * @license GPL-3.0
 */

//Importtaion de la librairie sequelize
const Sequelize = require('sequelize');

// Importation de la bdd
const db = require('../models');

module.exports = (id) => {
    return new Promise(async (resolve, reject) => {
        db.Like.findAll({
            attributes: ['id_User','id_Picture'],
            where: {id_Picture: id}
        })
        .then(like => {
            if(like.length != 0) {
                resolve(like);
            }
            else {
                resolve(false);
            }
        })
        .catch(err => {
            resolve(err);
        })
    });
  };