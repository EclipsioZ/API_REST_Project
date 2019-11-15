/**
 * @file getNameOfUser
 * @author EclipsioZ
 * @license GPL-3.0
 */

// Importation de la bdd
const db = require('../models');

module.exports = (id) => {
    return new Promise(async (resolve, reject) => {
        db.User.findOne({
            attributes: ['id','lastname','firstname'],
            where: {id: id}
        })
        .then(userName => {
            var name = [userName.firstname,userName.lastname];
            resolve(name);
        })
        .catch(err => {
            resolve(err);
        })
    });
  };
