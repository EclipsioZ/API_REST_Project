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
            attributes: ['id','lastname','firstname','mail'],
            where: {id: id}
        })
        .then(userName => {
            var name = [userName.firstname,userName.lastname,userName.mail];
            resolve(name);
        })
        .catch(err => {
            resolve(err);
        })
    });
  };
