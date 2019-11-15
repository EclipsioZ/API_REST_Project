/**
 * @file delAllRegister
 * @author EclipsioZ
 * @license GPL-3.0
 */

//Importtaion de la librairie sequelize
const Sequelize = require('sequelize');

// Importation de la bdd
const db = require('../models');

// Importation du module getAllComments
const getAllRegister = require('../utils/getAllRegister.js');

module.exports = (id) => {
    return new Promise(async (resolve, reject) => {

        var allRegister = await getAllRegister(id);
        
        if(allRegister == false) {

            resolve(true);
            
        } else {

            db.Register.destroy({
                where: {id_Activities: id}
            })
            .then(register => {;
                    resolve(true);
            })
            .catch(err => {
                resolve(err);
            })
        }
    });
  };