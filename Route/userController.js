/**
 * @file userController
 * @author EclipsioZ
 * @license GPL-3.0
 */

 // Importation de la librairie bcrypt
 const bcrypt = require('bcrypt');

 // Importation de la librairie jwt.utils
 const jwtUtils = require('../utils/jwt.utils.js')

  // Importation de la librairie jwt
  var jwt = require('jsonwebtoken');

 // Importation de la bdd
 const db = require('../models');


 // Définition des routes des utilisateurs
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
    update: function(req, res){

        var token = req.header('token');
        decryptedToken = jwt.decode(token);
        var id = req.body.id;
        var lastname = req.body.lastname;
        var firstname = req.body.firstname;
        var mail = req.body.mail;
        var password = req.body.firstname;
        var id_Preferences = req.body.id_Preferences;
        var id_Center = req.body.id_Center;
        userRank = decryptedToken.userRank;
        id_User = decryptedToken.userId;

        if(userRank >= 1) {
            db.User.findOne({
                attributes: ['id','lastname','firstname','mail','password','id_Preferences','id_Center'],
                where: {id: id}
            })
            .then(function(updateUser){

                if(updateUser) {
                    bcrypt.hash(password, 5, function(err, bcryptedPassword) {
                        db.User.update({
                            lastname: lastname,
                            firstname: firstname,
                            mail: mail,
                            password: bcryptedPassword,
                            id_Preferences: id_Preferences,
                            id_Center: id_Center

                            },{where: {id: id}
                        })
                        .then(function(upUser) {
                            return res.status(201).json({'success': "Profil modifiée!"});
                        })
                        .catch(function(err) {
                        return res.status(500).json({'error': 'Erreur lors de la modification du profil!'});
                        });
                    });
                } else {
                    return res.status(409).json({'error': 'Cette Utilisateur n\'existe pas !'});
                }
            })
            .catch(function(err) {
                return res.status(500).json({ 'error': 'Impossible de vérifier l\'utilisateur !'});
            });
        } else {
            return res.status(500).json({ 'error': 'Vous n\'avez pas la permission de modifier le profil !'});
        }
    },
    getAll: function(req, res){

        var token = req.header('token');
        var id = req.query.id_Rank;
        decryptedToken = jwt.decode(token);
        id_Rank = decryptedToken.userRank;
        id_User = decryptedToken.userId;

        if(id_Rank >= 1) {

            if(id) {
                db.User.findAll({
                    attributes: ['id','mail','lastname','firstname','id_Rank','id_Center','id_Preferences'],
                    where: {id_Rank: id}
                })
                .then(allUsers => {
                    if(allUsers) {
                        return res.status(200).json({allUsers});
                    } else {
                        return res.status(409).json({'error': 'Aucun utilisateurs avec ce rang !'});
                    }
    
                })
                .catch(err => {
                    return res.status(500).json({'error': 'Impossible de vérifier les utilisateurs !'});
                });
            } else {
                db.User.findAll({
                    attributes: ['id','mail','lastname','firstname','id_Rank','id_Center','id_Preferences'],
                })
                .then(allUsers => {
                    if(allUsers) {
                        return res.status(200).json({allUsers});
                    } else {
                        return res.status(409).json({'error': 'Aucun utilisateurs !'});
                    }
    
                })
                .catch(err => {
                    return res.status(500).json({'error': 'Impossible de vérifier les utilisateurs !'});
                });
            }
        } else {
            return res.status(500).json({ 'error': 'Vous devez être membre du BDE pour accéder à ces informations !'});
        }

    },
    get: function(req, res){
        var id = req.query.id;

                db.User.findAll({
                    attributes: ['id','mail','lastname','firstname','id_Rank','id_Center','id_Preferences'],
                    where: {id: id}
                })
                .then(user => {
                    if(user) {
                        return res.status(200).json({user});
                    } else {
                        return res.status(409).json({'error': 'Aucun utilisateurs avec cette id !'});
                    }
    
                })
                .catch(err => {
                    return res.status(500).json({'error': 'Impossible de vérifier les utilisateurs !'});
                });

    }
 }