/**
 * @file paramController
 * @author EclipsioZ
 * @license GPL-3.0
 */

  // Importation de la librairie jwt
  var jwt = require('jsonwebtoken');

 // Importation de la bdd
 const db = require('../models');

 // Définition des routes de paramètre
 module.exports = {

    centers: function(req, res){
        
        //On récupère les informations de tous les centres
        db.Center.findAll({
            attributes: ['id','label']
        }).then(centers => {
            return res.status(200).json({centers});
        })

    },
    rank: function(req, res){
        
        //On récupère les informations de tous les rangs
        db.Rank.findAll({
            attributes: ['id','label']
        }).then(ranks => {
            return res.status(200).json({ranks});
        })

    },
    recurrence: function(req, res){
        
        //On récupère les informations de toutes les récurrences
        db.Recurrence.findAll({
            attributes: ['id','label']
        }).then(recurrences => {
            return res.status(200).json({recurrences});
        })

    },
    state: function(req, res){
        
        //On récupère les informations de tous les états
        db.State.findAll({
            attributes: ['id','label']
        }).then(states => {
            return res.status(200).json({states});
        })

    },
    preference: function(req, res){
        
        //On récupère les informations de toutes les préférences
        db.Preferences.findAll({
            attributes: ['id','theme','notification']
        }).then(preferences => {
            return res.status(200).json({preferences});
        })

    },
    /*updatePreference: function(req, res){

        var token = req.header('token');
        decryptedToken = jwt.decode(token);
        var id = req.body.id;
        var theme = req.body.theme;
        var notification = req.body.notification;
        id_Rank = decryptedToken.userRank;
        id_User = decryptedToken.userId;

        if(id_Rank >= 1) {
            db.Preferences.findOne({
                attributes: ['id','theme','notification'],
                where: {id: id}
            })
            .then(function(updatePreference){

                if(updatePreference) {
                    db.Preferences.update({
                        theme: theme,
                        notification: notification
                        },{where: {id: id}})
                        .then(function(upPreference) {
                            return res.status(201).json({'success': "Préférences modifiée!"});
                        })
                        .catch(function(err) {
                            console.log(err)
                        return res.status(500).json({'error': 'Erreur lors de la modification des préférences !'});
                        });
                } else {
                    return res.status(409).json({'error': 'Ces préférences n\'existe pas !'});
                }
            })
            .catch(function(err) {
                console.log(err);
                return res.status(500).json({ 'error': 'Impossible de vérifier les préférences !'});
            });
        } else {
            return res.status(500).json({ 'error': 'Vous n\'avez pas la permission de modifier les préférences !'});
        }
    },*/
    updatePreference: function(req, res){

        //Récupération des paramètres
        var token = req.header('token');
        decryptedToken = jwt.decode(token);
        var id_Preferences = req.body.id_Preferences;
        id_Rank = decryptedToken.userRank;
        id_User = decryptedToken.userId;

        //Vérifie si l'utilisateur est au moins étudiant sur le site
        if(id_Rank >= 1) {
            //Récupération de l'identifiant des préférences d'un utilisateurs à partir de son identifiant
            db.User.findOne({
                attributes: ['id_Preferences'],
                where: {id: id_User}
            })
            .then(function(updatePreference){

                //Vérifie si l'utilisateur existe bien
                if(updatePreference) {
                    //On met à jour les préférences de l'utilisateur à partir de son identifiant et de l'identifiant de préférences
                    db.User.update({
                        id_Preferences: id_Preferences
                        },{where: {id: id_User}})
                        .then(function(upPreference) {
                            return res.status(201).json({'success': "Préférences modifiée!"});
                        })
                        .catch(function(err) {
                            console.log(err)
                        return res.status(500).json({'error': 'Erreur lors de la modification des préférences !'});
                        });
                } else {
                    return res.status(409).json({'error': 'Ces préférences n\'existe pas !'});
                }
            })
            .catch(function(err) {
                console.log(err);
                return res.status(500).json({ 'error': 'Impossible de vérifier les préférences !'});
            });
        } else {
            return res.status(500).json({ 'error': 'Vous n\'avez pas la permission de modifier les préférences !'});
        }
    },
    category: function(req, res){
        
        //On récupère les informations de toutes les catégories
        db.Category.findAll({
            attributes: ['id','label']
        }).then(categories => {
            return res.status(200).json({categories});
        })

    },


 }