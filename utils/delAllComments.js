/**
 * @file delAllComments
 * @author EclipsioZ
 * @license GPL-3.0
 */

//Importtaion de la librairie sequelize
const Sequelize = require('sequelize');

// Importation de la bdd
const db = require('../models');

// Importation du module delAllCommentsOfComments
const delAllCommentsOfComments = require('../utils/delAllCommentsOfComments.js');

// Importation du module getAllComments
const getAllComments = require('../utils/getAllComments.js');

module.exports = (id) => {
    return new Promise(async (resolve, reject) => {

        var allComments = await getAllComments(id);

        if(allComments == false) {
            resolve(true);
        } else {
            for(i=0; i < allComments.length - 1; i++) {
                await delAllCommentsOfComments(allComments[i].id);
            }

            db.Comments.destroy({
                where: {id_Picture: id}
            })
            .then(Comment => {;
                    resolve(true);
            })
            .catch(err => {
                resolve(err);
            })
        }
    });
  };