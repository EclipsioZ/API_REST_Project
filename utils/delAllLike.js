/**
 * @file delAllLike
 * @author EclipsioZ
 * @license GPL-3.0
 */

//Importtaion de la librairie sequelize
const Sequelize = require('sequelize');

// Importation de la bdd
const db = require('../models');

// Importation du module getAllComments
const getAllLike = require('../utils/getAllLike.js');

module.exports = (id) => {
    return new Promise(async (resolve, reject) => {

        var allLikes = await getAllLike(id);

        if(allLikes == false) {

            resolve(true);

        } else {

            db.Like.destroy({
                where: {id_Picture: id}
            })
            .then(like => {;
                    resolve(true);
            })
            .catch(err => {
                resolve(err);
            })
            
        }
    });
  };