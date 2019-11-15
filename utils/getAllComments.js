/**
 * @file getAllComments
 * @author EclipsioZ
 * @license GPL-3.0
 */

//Importtaion de la librairie sequelize
const Sequelize = require('sequelize');

// Importation de la bdd
const db = require('../models');

module.exports = (id) => {
    return new Promise(async (resolve, reject) => {
        db.Comments.findAll({
            attributes: ['id','content','id_User','id_Picture','id_Comments'],
            where: {id_Picture: id, id_Comments: null}
        })
        .then(comment => {
            if(comment.length != 0) {
                resolve(comment);
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