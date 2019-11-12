/**
 * @file centerController
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

    susbcribe: function(req, res){

        var token = req.header('token');
        var id_Activities = req.header('id_Activities');
        test = jwt.decode(token);

        
        return res.status(200).json({'success': "OK"});

    },
    get: function(req, res){

        var token = req.header('token');
        var id_Activities = req.header('id_Activities');
        decryptedToken = jwt.decode(token);
        id_Rank = decryptedToken.userRank;

        if(id_Rank == 1) {
            db.Activities.findOne({
                attributes: ['id','title','description','picture','begin_date','end_date','top_event','price','id_User','id_Center','id_State','id_Recurrence'],
                where: {id: id_Activities}
            })
            .then(GetActivitiesFound => {
                if(GetActivitiesFound) {
                    return res.status(200).json({GetActivitiesFound});
                } else {
                    return res.status(409).json({'error': 'Cette event n\'existe pas !'});
                }
    
            })
            .catch(err => {
                return res.status(500).json({'error': 'Impossible de vérifier l\'event !'});
            });
        }
        else {
            return res.status(500).json({'error': "You don't have the permission !"});
        }

    },
    all: function(req, res){

        var token = req.header('token');
        decryptedToken = jwt.decode(token);
        id_Rank = decryptedToken.userRank;

        if(id_Rank >= 1) {

            db.Activities.findAll({
                attributes: ['id','title','description','picture','begin_date','end_date','top_event','price','id_User','id_Center','id_State','id_Recurrence']
            })
            .then(AllActivitiesFound => {
                if(AllActivitiesFound) {
                    return res.status(200).json({AllActivitiesFound});
                } else {
                    return res.status(409).json({'error': 'Cette event n\'existe pas !'});
                }
    
            })
            .catch(err => {
                return res.status(500).json({'error': 'Impossible de vérifier l\'event !'});
            });
        }
        else {
            return res.status(500).json({'error': "You don't have the permission !"});
        }

    },
    commentsAdd: function(req, res){

        var token = req.header('token');
        test = jwt.decode(token);
        console.log(test);
        return res.status(200).json({'success': "OK"});

    },
    commentsRemove: function(req, res){

        var token = req.header('token');
        test = jwt.decode(token);
        console.log(test);
        return res.status(200).json({'success': "OK"});

    }
 }