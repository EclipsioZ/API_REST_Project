/**
 * @file userController
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

    register: function(req, res){

        //Récupération des paramètres
        var lastname = req.body.lastname;
        var firstname = req.body.firstname;
        var mail = req.body.mail;
        var password = req.body.password;
        var id_Center = req.body.id_Center;

        if(mail == "" || lastname == "" ||  firstname == "" ||  password == ""  ||  id_Center == "") {
            return res.status(400).json({'error': 'Paramètres manquants !'});
        }

        db.User.findOne({
            attributes: ['mail'],
            where: {mail: mail}
        })
        .then(function(userFound){
            if(!userFound) {
                bcrypt.hash(password, 5, function(err, bcryptedPassword) {
                  var newUser = db.User.create({
                    mail: mail,
                    lastname: lastname,
                    firstname: firstname,
                    password: bcryptedPassword,
                    id_Preferences: 1,
                    id_Center: id_Center,
                    id_Rank: 1
                    
                  })
                  .then(function(newUser) {
                      return res.status(201).json({'success': "OK"});
                  })
                  .catch(function(err) {
                    return res.status(500).json({'error': 'Impossible d\'ajouter le nouveau utilisateur'});
                  });
                });

            } else {
                return res.status(409).json({'error': 'Utilisateur déjà  existant !'});
            }
        })
        .catch(function(err) {
            return res.status(500).json({ 'error': 'Impossible de vérifier l\'utilisateur !'});
        });

    },
    login: function(req, res){

        var mail = req.body.mail;
        var password = req.body.password;


        if (mail == "" || password == ""){
            return res.status(400).json({'error': 'Paramètres manquants !'});
        }

        db.User.findOne({
            attributes: ['mail','lastname','firstname','password','id','id_Rank','id_Center','id_Preferences'],
            where: { mail: mail }
        })
        .then(function(userFound){      
            if(userFound) {
                bcrypt.compare(password, userFound.password, function(errBycrypt, resBycrypt) {
                    if(resBycrypt) {
                        return res.status(200).json({
                            'id': userFound.id,
                            'mail': userFound.mail,
                            'lastname': userFound.lastname,
                            'firstname': userFound.firstname,
                            'id_Center': userFound.id_Center,
                            'id_Preferences': userFound.id_Preferences,
                            'id_Rank': userFound.id_Rank,
                            'token': jwtUtils.generateTokenForUser(userFound)
                        });
                    } else {
                        return res.status(403).json({"error": 'Le mot de passe rentré n\'est pas correct !'})
                    }
                });

            } else {
                return res.status(409).json({'error': 'Cette utilisateur n\'existe pas !'});
            }
        })
        .catch(function(err) {
            return res.status(500).json({ 'error': 'Impossible de vérifier l\'utilisateur !'});
        });
    },
    eventOld: function(req, res){

        var id_Activities = req.query.id_Activities;

        db.Activities.findOne({
            attributes: ['id','title','description','picture','begin_date','end_date','top_event','price','id_User','id_Center','id_State','id_Recurrence'],
            where: {id: id_Activities}
        })
        .then(OldActivitiesFound => {
            if(OldActivitiesFound) {
                return res.status(200).json({
                    'id': OldActivitiesFound.id,
                    'title': OldActivitiesFound.title,
                    'description': OldActivitiesFound.description,
                    'picture': OldActivitiesFound.picture,
                    'begin_date': OldActivitiesFound.begin_date,
                    'end_date': OldActivitiesFound.end_date,
                    'top_event': OldActivitiesFound.top_event,
                    'price': OldActivitiesFound.price,
                    'id_User': OldActivitiesFound.id_User,
                    'id_Center': OldActivitiesFound.id_Center,
                    'id_State': OldActivitiesFound.id_State,
                    'id_Recurrence': OldActivitiesFound.id_Recurrence
                });
            } else {
                return res.status(409).json({'error': 'Cette activité n\'existe pas !'});
            }

        })
        .catch(err => {
            return res.status(500).json({'error': 'Impossible de vérifier l\'activité !'});
        });

    }
 }