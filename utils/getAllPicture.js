/**
 * @file getActivities
 * @author EclipsioZ
 * @license GPL-3.0
 */

// Importation de la bdd
const db = require('../models');

module.exports = (id) => {
    return new Promise(async (resolve, reject) => {
        db.Picture.findAll({
            attributes: ['id','link','id_User','id_Activities'],
            where: {id_Activities: id}
        })
        .then(activities => {;
            if(activities) {
                resolve(activities);
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