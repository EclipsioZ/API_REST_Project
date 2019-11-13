/**
 * @file eventController
 * @author EclipsioZ
 * @license GPL-3.0
 */


 const Sequelize = require('sequelize');

 // Importation de la librairie bcrypt
 const bcrypt = require('bcrypt');

 // Importation de la librairie jwt
 var jwt = require('jsonwebtoken');


 // Importation de la bdd
 const db = require('../models');

 // Importation du module getusername
 const nameofuser = require('../utils/getNameOfUser.js');

  // Importation du module getActivities
  const getActivities = require('../utils/getActivities.js');

// Importation du module getAllPicture
const  getAllPicture = require('../utils/getAllPicture.js');

// Importation du module getAllComments
const getAllComments = require('../utils/getAllComments.js');

// Importation du module getAllCommentsOfComments
const getAllCommentsOfComments = require('../utils/getAllCommentsOfComments.js');

 // Définition de nos routes
 module.exports = {

    subscribe: function(req, res){

        var token = req.header('token');
        var id_Activities = req.body.id_Activities;
        var id_User = req.body.id_User;
        decryptedToken = jwt.decode(token);
        id_Rank = decryptedToken.userRank;

        if(id_Rank >= 1) {

        db.Register.findOne({
            attributes: ['id_User','id_Activities'],
            where: {id_User: id_User, id_Activities: id_Activities}
        })
        .then(function(register){

            if(!register) {
                  var newRegister = db.Register.create({
                    id_User: id_User,
                    id_Activities: id_Activities
                  })
                  .then(function(newRegister) {
                      return res.status(201).json({'success': "Enregistrement OK !"});
                  })
                  .catch(function(err) {
                    return res.status(500).json({'error': 'Erreur lors de l\'enregistrement'});
                  });
            } else {
                return res.status(409).json({'error': 'Vous vous êtes déjà inscris à cette event !'});
            }
        })
        .catch(function(err) {
            return res.status(500).json({ 'error': 'Impossible de vérifier l\'utilisateur !'});
        });
    }

    },

    unsubscribe: function(req, res){

        var token = req.header('token');
        var id_Activities = req.body.id_Activities;
        var id_User = req.body.id_User;
        decryptedToken = jwt.decode(token);
        id_Rank = decryptedToken.userRank;

        if(id_Rank >= 1) {

        db.Register.findOne({
            attributes: ['id_User','id_Activities'],
            where: {id_User: id_User, id_Activities: id_Activities}
        })
        .then(function(unregister){

            if(unregister) {
                  db.Register.destroy({
                    where: {id_User: id_User, id_Activities: id_Activities}
                  })
                  .then(function(unregisters) {
                      return res.status(201).json({'success': "Désabonnement OK !"});
                  })
                  .catch(function(err) {
                    return res.status(500).json({'error': 'Erreur lors du désabonnement !'});
                  });
            } else {
                return res.status(409).json({'error': 'Vous n\'êtes pas incris à cette événement !'});
            }
        })
        .catch(function(err) {
            return res.status(500).json({ 'error': 'Impossible de vérifier les paramètres !'});
        });
    }

    },
    get: async function(req, res) {

        var token = req.header('token');
        var id_Activities = req.header('id_Activities');
        decryptedToken = jwt.decode(token);
        id_Rank = decryptedToken.userRank;

        if(id_Rank == 1) {

            var activities = await getActivities(id_Activities);

            var pictures = await getAllPicture(activities.id);

            if(pictures.length == 0) return res.status(200).json({activities});
            
            for(i = 0; i < pictures.length; i++){
                
                var comments = await getAllComments(pictures[i].id);

                if(comments.length != 0) {

                for(j = 0; j < comments.length; j++){

                    var commentsOfComments = await getAllCommentsOfComments(comments[j].id);

                    if(commentsOfComments.length != 0) {

                        for(v = 0; v < comments.length; v++){

                            var usercommentsOfComments = await nameofuser(commentsOfComments[v].id_User);

                            commentsOfComments[v] = {
                                id: comments[j].id,
                                content: commentsOfComments[v].content,
                                id_User: commentsOfComments[v].id_User,
                                userLastname: usercommentsOfComments[0],
                                userFirstname: usercommentsOfComments[1],
                                id_Picture: commentsOfComments[v].id_Picture,
                                id_Comments: commentsOfComments[v].id_Comments,
                            }
                        }
                    }

                    var userComments = await nameofuser(comments[j].id_User);
                    
                    comments[j] = {
                        id: comments[j].id,
                        content: comments[j].content,
                        id_User: comments[j].id_User,
                        userLastname: userComments[0],
                        userFirstname: userComments[1],
                        id_Picture: comments[j].id_Picture,
                        id_Comments: comments[j].id_Comments,
                        commentsOfComments: commentsOfComments
                    }
                }

            }
                var userPicture = await nameofuser(pictures[i].id_User);

                pictures[i] = {
                    id: pictures[i].id,
                    link: pictures[i].link,
                    id_User: pictures[i].id_User,
                    userLastname: userPicture[0],
                    userFirstname: userPicture[1],
                    id_Activities: pictures[i].id_Activities,
                    comment: comments
                }

            }
            return res.status(200).json({activities, pictures});
        }
        else {
            return res.status(500).json({'error': "You don't have the permission !"});
        }

    },
    all: function(req, res){

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
    },
    commentsAdd: function(req, res){

        var token = req.header('token');
        var content = req.body.content;
        var id_Picture = req.body.id_Picture;
        var id_User = req.body.id_User;
        var id_Comments = req.body.id_Comments;
        decryptedToken = jwt.decode(token);
        id_Rank = decryptedToken.userRank;

        if(id_Rank >= 1) {

        db.Comments.findOne({
            attributes: ['content','id_User','id_Picture','id_Comments'],
            where: {content: content, id_User: id_User, id_Picture: id_Picture}
        })
        .then(function(addComment){

            if(!addComment) {
                  var newComment = db.Comments.create({
                    content: content,
                    id_User: id_User,
                    id_Picture: id_Picture,
                    id_Comments: id_Comments
                  })
                  .then(function(newComment) {
                      return res.status(201).json({'success': "Message posté OK !"});
                  })
                  .catch(function(err) {
                    return res.status(500).json({'error': 'Erreur lors du post de message'});
                  });
            } else {
                return res.status(409).json({'error': 'Vous avez déjà posté ce commentaire !'});
            }
        })
        .catch(function(err) {
            return res.status(500).json({ 'error': 'Impossible de vérifier l\'utilisateur !'});
        });
    }

    },
    commentsRemove: async function(req, res){

        var token = req.header('token');
        test = jwt.decode(token);

        var test = await nameofuser(1);
        return res.status(200).json({test});

    }
 }