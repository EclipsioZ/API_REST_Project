/**
 * @file delAllPicture
 * @author EclipsioZ
 * @license GPL-3.0
 */

//Importtaion de la librairie sequelize
const Sequelize = require('sequelize');

// Importation de la bdd
const db = require('../models');

// Importation du module delAllCommentsOfComments
const delAllComments = require('../utils/delAllComments.js');

// Importation du module delAllCommentsOfComments
const delAllLike= require('../utils/delAllLike.js');

// Importation du module getAllComments
const getAllPicture = require('../utils/getAllPicture.js');

module.exports = (id) => {
    return new Promise(async (resolve, reject) => {

        var allPictures = await getAllPicture(id);

        if(allPictures == false) {

            resolve(true);

        } else {

            for(i=0; i < allPictures.length; i++) {
            await delAllComments(allPictures[i].id);
            await delAllLike(allPictures[i].id);
            }

            db.Picture.destroy({
                where: {id_Activities: id}
            })
            .then(Picture => {;
                    resolve(true);
            })
            .catch(err => {
                resolve(err);
            })
        }
    });
  };