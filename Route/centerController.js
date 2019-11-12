/**
 * @file centerController
 * @author EclipsioZ
 * @license GPL-3.0
 */

 // Importation de la librairie bcrypt
 const bcrypt = require('bcrypt');

 // Importation de la librairie jwt.utils
 const jwtUtils = require('../utils/jwt.utils.js')


 // Importation de la bdd
 const db = require('../models');

 // Définition de nos routes

 module.exports = {

    centers: function(req, res){

        var mail = req.body.mail;
        var id = req.body.id_Center;


        // if(mail == "" || id == "") {
        //     return res.status(400).json({'error': 'Paramètres manquants !'});
        // }

        // db.User.findOne({
        //     attributes: ['id'],
        //     where: {id_Center: id},
        //     include: [{
        //         model: db.Center,
        //         attributes: ['label']
        //     }]
        // }).then(name => {
        //     if(name) {
        //     console.log(name.Center.label);
        //     return res.status(403).json({"error": 'Good !'})
        //     }
        //     else {
        //         return res.status(403).json({"error": 'Not good !'})
        //     }
        // });


        db.Center.findAll({
            attributes: ['id','label']
        }).then(centers => {
            return res.status(200).json({centers})
        })

        // db.User.findOne({
        //     attributes: ['mail','id'],
        //     where: {mail: mail}
        // })
        // .then(function(userFound){  
        //     if(userFound) {
        //     }
            
        // })
        // .catch(function(err) {
        //     return res.status(500).json({ 'error': 'Impossible de vérifier l\'utilisateur !'});
        // });

    }
 }