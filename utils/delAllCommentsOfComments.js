/**
 * @file delAllCommentsOfComments
 * @author EclipsioZ
 * @license GPL-3.0
 */

//Importtaion de la librairie sequelize
const Sequelize = require('sequelize');

// Importation de la bdd
const db = require('../models');

module.exports = (id) => {
    return new Promise(async (resolve, reject) => {
        db.Comments.destroy({
            where: {id_Comments: id}
        })
        .then(commentOfComment => {;
                resolve(true);
        })
        .catch(err => {
            resolve(err);
        })
    });
  };