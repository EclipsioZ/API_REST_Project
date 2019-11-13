/**
 * @file getActivities
 * @author EclipsioZ
 * @license GPL-3.0
 */

// Importation de la bdd
const db = require('../models');

module.exports = (id) => {
    return new Promise(async (resolve, reject) => {
        db.Activities.findOne({
            attributes: ['id','title','description','picture','begin_date','end_date','top_event','price','id_User','id_Center','id_State','id_Recurrence'],
            where: {id: id}
        })
        .then(userName => {;
            if(userName) {
                resolve(userName);
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