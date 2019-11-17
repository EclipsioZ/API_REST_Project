/**
 * @file tokenController
 * @author EclipsioZ
 * @license GPL-3.0
 */

 // Importation de la librairie bcrypt
 const bcrypt = require('bcrypt');

 // Importation de la librairie jwt
 var jwt = require('jsonwebtoken');


 // Importation de la bdd
 const db = require('../models');

 // Définition de nos routes

 module.exports = {

    page: function(req, res){

        //Récupération des paramètres
        var token = req.header('token');
        test = jwt.decode(token);
        console.log(test);
        return res.status(200).json({'success': "OK"});

    },
    token: function(req, res){

        //Récupération des paramètres
        var token = req.header('token');
        decryptedToken = jwt.decode(token);
        id_Rank = decryptedToken.userRank;

        if(id_Rank == 0) {
            return res.status(200).json({'success': "OK"});
        }
        else {
            return res.status(500).json({'error': "You don't have the permission !"});
        }

    }
 }