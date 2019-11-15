/**
 * @file getAllPicture
 * @author EclipsioZ
 * @license GPL-3.0
 */

// Importation de la bdd
const db = require('../models');

module.exports = (id) => {

    return new Promise(async (resolve, reject) => {
        db.Product.findAll({
            attributes: ['id','label','description','picture','price','delevery_date','nb_sales','id_Center','id_Category'],
            where: {id_Category: id}
        })
        .then(product => {
            if(product) {
                resolve(product);
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