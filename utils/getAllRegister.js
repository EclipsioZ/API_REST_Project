/**
 * @file getAllRegister
 * @author EclipsioZ
 * @license GPL-3.0
 */

// Importation de la bdd
const db = require('../models');

module.exports = (id) => {

    return new Promise(async (resolve, reject) => {
        db.Register.findAll({
            attributes: ['id_Activities','id_User'],
            where: {id_Activities: id}
        })
        .then(register => {
            if(register != 0) {
                resolve(register);
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