/**
 * @file eventController
 * @author EclipsioZ
 * @license GPL-3.0
 */

 const Sequelize = require('sequelize');

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

// Importation du module delAllCommentsOfComments
const delAllCommentsOfComments = require('../utils/delAllCommentsOfComments.js');

// Importation du module delAllComments
const delAllComments = require('../utils/delAllComments.js');

// Importation du module delAllPicture
const delAllPictures = require('../utils/delAllPicture.js');

// Importation du module delAllLike
const delAllLike = require('../utils/delAllLike.js');

// Importation du module delAllRegister
const delAllRegister = require('../utils/delAllRegister.js');

// Définition des routes des events
module.exports = {
    get: async function(req, res) {

        //Récupération des paramètres
        var token = req.header('token');
        var id_Activities = req.query.id_Activities;
        if(token == 0) return res.status(500).json({'error': "Erreur liés au token !"});
        decryptedToken = jwt.decode(token);
        if(decryptedToken.userRank == null) return res.status(500).json({'error': "Erreur liés au token !"});
        id_Rank = decryptedToken.userRank;

        //Vérifie si l'utilisateur est au moins étudiant sur le site
        if(id_Rank >= 1) {

            //Module qui permet de récupérer une activité à partir de son identifiant
            var activity = await getActivities(id_Activities);

            //Vérifie si l'activité existe bien
            if(activity == false) return res.status(500).json({'error': "Cet id n'existe pas !"});

            //Module qui permet de récupérer toutes les images d'une activité grâce à son identifiant
            var pictures = await getAllPicture(activity.id);

            //Vérifie si il y a au moins une image sur l'activité
            if(pictures.length == 0) return res.status(200).json({activity});
            
            for(i = 0; i < pictures.length; i++){
                
                //Module qui permet de récupérer tous les commentaires d'une image grâce à son identifiant
                var comments = await getAllComments(pictures[i].id);

                //Vérifie si il y a au moins un commentaire sur l'image
                if(comments.length != 0) {

                for(j = 0; j < comments.length; j++){

                    //Module qui permet de récupérer tous les sous-commentaires d'un commentaire grâce à son identifiant
                    var commentsOfComments = await getAllCommentsOfComments(comments[j].id);

                    if(commentsOfComments.length != 0) {

                        for(v = 0; v < commentsOfComments.length; v++){

                            //Module qui permet de récupérer les informations d'un utilisateur à partir de son identifiant
                            var usercommentsOfComments = await nameofuser(commentsOfComments[v].id_User);

                            commentsOfComments[v] = {
                                id: commentsOfComments[v].id,
                                content: commentsOfComments[v].content,
                                id_User: commentsOfComments[v].id_User,
                                userLastname: usercommentsOfComments[0],
                                userFirstname: usercommentsOfComments[1],
                                id_Picture: commentsOfComments[v].id_Picture,
                                id_Comments: commentsOfComments[v].id_Comments,
                            }
                        }
                    }

                    //Module qui permet de récupérer les informations d'un utilisateur à partir de son identifiant
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
                //Module qui permet de récupérer les informations d'un utilisateur à partir de son identifiant            
                var userPicture = await nameofuser(pictures[i].id_User);

                pictures[i] = {
                    id: pictures[i].id,
                    link: pictures[i].link,
                    id_User: pictures[i].id_User,
                    userLastname: userPicture[0],
                    userFirstname: userPicture[1],
                    id_Activities: pictures[i].id_Activities,
                    comments: comments
                }

            }
            //Renvoie toutes les informations d'une activité ainsi que toutes les photos aui ont été postés dessus
            return res.status(200).json({activity, pictures});
        }
        else {
            return res.status(500).json({'error': "You don't have the permission !"});
        }

    },
    all: function(req, res){

        //Récupération des informations de toutes les activités
        db.Activities.findAll({
            attributes: ['id','title','description','picture','begin_date','end_date','top_event','price','id_User','id_Center','id_State','id_Recurrence']
        })
        .then(AllActivitiesFound => {
            //Vérifie si exite au moins une activité
            if(AllActivitiesFound) {
                //On renvoie toutes les activités trouvés
                return res.status(200).json({AllActivitiesFound});
            } else {
                return res.status(409).json({'error': 'Cette event n\'existe pas !'});
            }

        })
        .catch(err => {
            return res.status(500).json({'error': 'Impossible de vérifier l\'event !'});
        });
    },
    add: function(req, res){

        //Récupération des paramètres
        var token = req.header('token');
        var title = req.body.title;
        var description = req.body.description;
        var picture = req.body.picture;
        var begin_date = req.body.begin_date;
        var end_date = req.body.end_date;
        var top_event = req.body.top_event;
        var price = req.body.price;
        var id_Center = req.body.id_Center;
        var id_State = req.body.id_State;
        var id_Recurrence = req.body.id_Recurrence;
        decryptedToken = jwt.decode(token);
        id_Rank = decryptedToken.userRank;
        id_User = decryptedToken.userId;

        //Vérifie si l'utilisateur est au moins membre du BDE sur le site
        if(id_Rank >= 3) {

        //Récupération des informations d'une activité à partir de son titre, sa description, son image, sa date de début, son prix et l'identifiant de son centre
        db.Activities.findOne({
            attributes: ['title','description','picture','begin_date','price','id_Center'],
            where: {title: title, description: description, picture: picture, begin_date: begin_date, price: price, id_Center: id_Center}
        })
        .then(function(addActivities){

            //Vérifie si l'activité existe pas
            if(!addActivities) {

                    //On créé une nouvelle activité à partir des paramètres
                    var newActivities = db.Activities.create({
                    title: title,
                    description: description,
                    picture: picture,
                    begin_date: begin_date,
                    end_date: end_date,
                    top_event: top_event,
                    price: price,
                    id_User: id_User,
                    id_Center: id_Center,
                    id_State: id_State,
                    id_Recurrence: id_Recurrence
                    })
                    .then(function(newActivity) {
                        return res.status(201).json({'success': "Event posté !"});
                    })
                    .catch(function(err) {
                        console.log(err)
                    return res.status(500).json({'error': 'Erreur lors du poste de l\'event !'});
                    });
            } else {
                return res.status(409).json({'error': 'Vous avez déjà posté cette event !'});
            }
        })
        .catch(function(err) {
            return res.status(500).json({ 'error': 'Impossible de vérifier l\'event!'});
        });
    } else { 
        return res.status(500).json({ 'error': 'Vous n\'avez pas la permission de poster cette event !'});
    }
    },
    update: function(req, res){

        //Récupération des paramètres
        var token = req.header('token');
        var id = req.body.id;
        var title = req.body.title;
        var description = req.body.description;
        var picture = req.body.picture;
        var begin_date = req.body.begin_date;
        var end_date = req.body.end_date;
        var top_event = req.body.top_event;
        var price = req.body.price;
        var id_Center = req.body.id_Center;
        var id_State = req.body.id_State;
        var id_Recurrence = req.body.id_Recurrence;
        decryptedToken = jwt.decode(token);
        id_Rank = decryptedToken.userRank;
        id_User = decryptedToken.userId;

        //Vérifie si l'utilisateur est au moins membre du BDE sur le site
        if(id_Rank >= 3) {

            //Récupération des informations d'une activité à partir de son identifiant
        db.Activities.findOne({
            attributes: ['id','title','description','picture','begin_date','price','id_Center'],
            where: {id: id}
        })
        .then(function(updateActivities){

            //Vérifie si l'activité existe bien
            if(updateActivities) {
                //On met à jour l'activité grâce à son identifiant et avec les paramètres
                db.Activities.update({
                    title: title,
                    description: description,
                    picture: picture,
                    begin_date: begin_date,
                    end_date: end_date,
                    top_event: top_event,
                    price: price,
                    id_User: id_User,
                    id_Center: id_Center,
                    id_State: id_State,
                    id_Recurrence: id_Recurrence
                    },{where: {id: id}})
                    .then(function(updateActivity) {
                        return res.status(201).json({'success': "Event modifié !"});
                    })
                    .catch(function(err) {
                    return res.status(500).json({'error': 'Erreur lors de la modification de l\'event !'});
                    });
            } else {
                return res.status(409).json({'error': 'Cette event n\'existe pas !'});
            }
        })
        .catch(function(err) {
            return res.status(500).json({ 'error': 'Impossible de vérifier l\'event!'});
        });
    } else { 
        return res.status(500).json({ 'error': 'Vous n\'avez pas la permission de modifier cette event !'});
    }
    },
    del: async function(req, res){

        //Récupération des paramètres
        var token = req.header('token');
        var id = req.body.id;
        decryptedToken = jwt.decode(token);
        id_Rank = decryptedToken.userRank;
        userId = decryptedToken.userId;

        //Récupération des informations d'une activité à partir de son identifiant
        db.Activities.findOne({
            attributes: ['id','id_User'],
            where: {id: id}
        })
        .then(async function(removeActivities){

            //Vérifie si l'activité existe bien
            if(removeActivities) {

                //Vérifie si l'utilisateur est au moins staff sur le site
                if(id_Rank >= 2) {

                    //Module qui permet de supprimer tous les subscriptions grâce à l'identifiant de l'activité
                    await delAllRegister(removeActivities.id);
                    //Module qui permet de supprimer toutes les images grâce à l'identifiant de l'activité
                    var allPictureDel = await delAllPictures(removeActivities.id);

                    if(allPictureDel == true){
                        //Suppression de l'activité grâce à son identifiant
                        db.Activities.destroy({
                            where: {id: removeActivities.id}
                            })
                            .then(function(activityRemove) {
                                return res.status(201).json({'success': "Activité retiré !"});
                            })
                            .catch(function(err) {
                            return res.status(500).json({'error': 'Erreur lors de la retiration de l\'activité !'});
                            });
                        }

                } else {
                    return res.status(500).json({'error': 'Vous n\'avez pas la permissions de retirer cette activité !'});
                }

            } else {
                return res.status(409).json({'error': 'Cette activité n\'existe pas !'});
            }
        })
        .catch(function(err) {
            console.log(err)
            return res.status(500).json({ 'error': 'Impossible de supprimer l\'activité !'});
        });
    },
    getSubscribe: function(req, res){

        //Récupération des paramètres
        var id_Activities = req.query.id_Activities;

        //Récupération des informations de toutes les subscriptions à partir de l'identifiant d'une activité
        db.Register.findAll({
            attributes: ['id_User'],
            where: {id_Activities: id_Activities}
        })
        .then(function(register){

            //Vérifie si la subscription existe bien
            if(register) {
                //Renvoies toutes les informations des subscribes de chaque utilisateurs sur une activité
                return res.status(201).json({register});
            } else {
                return res.status(409).json({'error': 'Pas inscris !'});
            }
        })
        .catch(function(err) {
            return res.status(500).json({ 'error': 'Impossible de vérifier l\'enregistrement !'});
        });

    },
    subscribe: function(req, res){

        //Récupération des paramètres
        var token = req.header('token');
        var id_Activities = req.body.id_Activities;
        decryptedToken = jwt.decode(token);
        id_Rank = decryptedToken.userRank;
        id_User = decryptedToken.userId;

        //Vérifie si l'utilisateur est au moins étudiant sur le site
        if(id_Rank >= 1) {

        //Récupération des informations d'un subscription à partir de l'identifiant de l'utilisateur et l'identifiant de l'activité
        db.Register.findOne({
            attributes: ['id_User','id_Activities'],
            where: {id_User: id_User, id_Activities: id_Activities}
        })
        .then(function(register){

            //Vérifie si la subscription n'existe pas
            if(!register) {

                    //On créé un subscribe à partir des paramètres
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
            return res.status(500).json({ 'error': 'Impossible de vérifier l\'enregistrement !'});
        });
    } else { 
        return res.status(500).json({ 'error': 'Vous n\'avez pas la permission de vous abonner !'});
    }

    },
    unsubscribe: function(req, res){

        //Récupération des paramètres
        var token = req.header('token');
        var id_Activities = req.body.id_Activities;
        decryptedToken = jwt.decode(token);
        id_Rank = decryptedToken.userRank;
        id_User = decryptedToken.userId;

        //Vérifie si l'utilisateur est au moins étudiant sur le site
        if(id_Rank >= 1) {

        //Récupération des informations d'une subscription à partir de l'identifiant de l'utilisateur et l'identifiant de l'activité
        db.Register.findOne({
            attributes: ['id_User','id_Activities'],
            where: {id_User: id_User, id_Activities: id_Activities}
        })
        .then(function(unregister){

            //Vérifie si la subscription existe bien
            if(unregister) {

                    //On supprime le subscribe à partir de l'identifiant de l'utilisateur et l'identifiant de l'activité
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
            return res.status(500).json({ 'error': 'Impossible de vérifier le désenregistrement !'});
        });
    } else { 
        return res.status(500).json({ 'error': 'Vous n\'avez pas la permission de vous désabonner !'});
    }

    },
    getComment: function(req, res){

        //Récupération des paramètres
        var token = req.header('token');
        var id = req.query.id;
        decryptedToken = jwt.decode(token);
        id_Rank = decryptedToken.userRank;
        id_User = decryptedToken.userId;

        //Vérifie si l'utilisateur est au moins étudiant sur le site
        if(id_Rank >= 1) {

            //Récupération des informations d'un commentaire à partir de son identifiant
            db.Comments.findOne({
                attributes: ['id','content','id_User','id_Picture','id_Comments'],
                where: {id: id}
            })
            .then(async function(getComment){

                //Vérifie si le commentaire existe bien
                if(getComment) {

                    //Module pour récupérer tous les sous-commentaires
                    var commentsOfComments = await getAllCommentsOfComments(getComment.id);

                    //Vérifie si il a au moins un sous-commentaires par commentaire
                    if(commentsOfComments.length != 0) {

                        for(i = 0; i < commentsOfComments.length; i++){

                            //Module pour récupérer toutes les informations d'un utilisateurs à partir de son identifiant
                            var usercommentsOfComments = await nameofuser(commentsOfComments[i].id_User);

                            commentsOfComments[i] = {
                                id: commentsOfComments[i].id,
                                content: commentsOfComments[i].content,
                                id_User: commentsOfComments[i].id_User,
                                userLastname: usercommentsOfComments[0],
                                userFirstname: usercommentsOfComments[1],
                                id_Picture: commentsOfComments[i].id_Picture,
                                id_Comments: commentsOfComments[i].id_Comments,
                            }
                        }
                    }

                    //Module pour récupérer toutes les informations d'un utilisateurs à partir de son identifiant
                    var userComments = await nameofuser(getComment.id_User);

                    getComment = {
                        id: getComment.id,
                        content: getComment.content,
                        id_User: getComment.id_User,
                        userLastname: userComments[0],
                        userFirstname: userComments[1],
                        id_Picture: getComment.id_Picture,
                        id_Comments: getComment.id_Comments,
                        commentsOfComments: commentsOfComments
                    }

                    //Renvoies le commentaire avec tous ses sous-commentaires
                    return res.status(201).json({getComment});
                } else {
                    return res.status(409).json({'error': 'Pas de commentaire !'});
                }
            })
            .catch(function(err) {
                console.log(err)
                return res.status(500).json({ 'error': 'Impossible de vérifier le commentaire !'});
            });
        } else { 
            return res.status(500).json({ 'error': 'Vous n\'avez pas la permission de récupérer le commentaire !'});
        }
    },
    commentsAdd: function(req, res){

        //Récupération des paramètres
        var token = req.header('token');
        var content = req.body.content;
        var id_Picture = req.body.id_Picture;
        var id_Comments = req.body.id_Comments;
        decryptedToken = jwt.decode(token);
        id_Rank = decryptedToken.userRank;
        id_User = decryptedToken.userId;

        //Vérifie si l'utilisateur est au moins étudiant sur le site
        if(id_Rank >= 1) {

        //Récupération des informations d'un commenatire à partir de son contenu, l'identifiant de l'utilisateur et l'identifiant de l'image
        db.Comments.findOne({
            attributes: ['content','id_User','id_Picture','id_Comments'],
            where: {content: content, id_User: id_User, id_Picture: id_Picture}
        })
        .then(function(addComment){

            //Vérifie si le commentaire n'existe pas
            if(!addComment) {

                    //On créé le commentaire à partir des paramètres
                    var newComment = db.Comments.create({
                    content: content,
                    id_User: id_User,
                    id_Picture: id_Picture,
                    id_Comments: id_Comments
                    })
                    .then(function(newComment) {
                        return res.status(201).json({'success': "Commentaire posté !"});
                    })
                    .catch(function(err) {
                    return res.status(500).json({'error': 'Erreur lors du post de ce commentaire !'});
                    });
            } else {
                return res.status(409).json({'error': 'Vous avez déjà posté ce commentaire !'});
            }
        })
        .catch(function(err) {
            return res.status(500).json({ 'error': 'Impossible de vérifier ce commentaire !'});
        });
    } else { 
        return res.status(500).json({ 'error': 'Vous n\'avez pas la permission de poster ce commentaire !'});
    }

    },
    commentsUpdate: function(req, res){

        //Récupération des paramètres
        var token = req.header('token');
        var id = req.body.id;
        var content = req.body.content;
        decryptedToken = jwt.decode(token);
        id_Rank = decryptedToken.userRank;
        id_User = decryptedToken.userId;


        //Récupération des informations d'un commentaire à partir de son identifiant
        db.Comments.findOne({
            attributes: ['id','content','id_User','id_Picture','id_Comments'],
            where: {id: id}
        })
        .then(function(updateComments){

            //Vérifie si le commentaire existe bien
            if(updateComments) {

                //Vérifie si le commentaire est bien celui posté par l'utilisateur
                if(updateComments.id_User == id_User) { 

                    //On met à jour le commentaire à partir des paramètres
                    db.Comments.update({
                        content: content,
                        id_User: updateComments.id_User,
                        id_Picture: updateComments.id_Picture,
                        id_Comments: updateComments.id_Comments,
                        },{where: {id: id}})
                        .then(function(updateComment) {
                            return res.status(201).json({'success': "Commentaire modifié !"});
                        })
                        .catch(function(err) {
                        return res.status(500).json({'error': 'Erreur lors de la modification de ce commentaire !'});
                        });

                //Vérifie si l'utilisateur à au moins le rang de staff sur le site
                } else if(id_Rank >= 2) {
                    
                    //On met à jour le commentaire à partir des paramètres
                    db.Comments.update({
                        content: content,
                        id_User: updateComments.id_User,
                        id_Picture: updateComments.id_Picture,
                        id_Comments: updateComments.id_Comments,
                        },{where: {id: id}})
                        .then(function(updateComment) {
                            return res.status(201).json({'success': "Commentaire modifié !"});
                        })
                        .catch(function(err) {
                        return res.status(500).json({'error': 'Erreur lors de la modification de ce commentaire !'});
                        });
                } else { 
                    return res.status(500).json({ 'error': 'Vous n\'avez pas la permission de modifier ce commentaire !'});
                }

            } else {
                return res.status(409).json({'error': 'Cette commentaire n\'existe pas !'});
            }
        })
        .catch(function(err) {
            return res.status(500).json({ 'error': 'Impossible de vérifier le commentaire !'});
        });
    },
    commentsRemove: async function(req, res){

        //Récupération des paramètres
        var token = req.header('token');
        var id = req.body.id;
        decryptedToken = jwt.decode(token);
        id_Rank = decryptedToken.userRank;
        userId = decryptedToken.userId;

        //Récupération des informations d'un commentaire à partir de son identifiant
        db.Comments.findOne({
            attributes: ['id','content','id_User','id_Picture','id_Comments'],
            where: {id: id}
        })
        .then(async function(removeComment){

            //Vérifie si le commentaire existe bien
            if(removeComment) {
                
                //Vérifie si le commentaire est bien celui posté par l'utilisateur
                if(removeComment.id_User == userId) {

                    //Suppression de tous les sous-commentaires
                    await delAllCommentsOfComments(removeComment.id);

                    //Suppression du commentaire à partir de son identifiant
                    db.Comments.destroy({
                        where: {id: id}
                        })
                        .then(function(commentRemove) {
                            return res.status(201).json({'success': "Commentaires retiré !"});
                        })
                        .catch(function(err) {
                        return res.status(500).json({'error': 'Erreur lors de la retiration du commentaire !'});
                        });

                //Vérifie si l'utilisateur à au moins le rang de staff sur le site
                } else if(id_Rank >= 2) {

                    //Suppression de tous les sous-commentaires
                    await delAllCommentsOfComments(removeComment.id);

                    //Suppression du commentaire à partir de son identifiant
                    db.Comments.destroy({
                        where: {id: removeComment.id}
                        })
                        .then(function(commentRemove) {
                            return res.status(201).json({'success': "Commentaires retiré !"});
                        })
                        .catch(function(err) {
                        return res.status(500).json({'error': 'Erreur lors de la retiration du commentaire !'});
                        });
                } else {
                    return res.status(500).json({'error': 'Vous n\'avez pas la permissions de retirer ce commentaire !'});
                }

            } else {
                return res.status(409).json({'error': 'Ce commentaire n\'existe pas !'});
            }
        })
        .catch(function(err) {
            return res.status(500).json({ 'error': 'Impossible de supprimer le commentaire !'});
        });
    },
    pictureAdd: function(req, res){

        //Récupération des paramètres
        var token = req.header('token');
        var link = req.body.link;
        var id_Activities = req.body.id_Activities;
        decryptedToken = jwt.decode(token);
        id_Rank = decryptedToken.userRank;
        id_User = decryptedToken.userId;

        //Vérifie si l'utilisateur est au moins étudiant sur le site
        if(id_Rank >= 1) {

        //Récupère les informations d'une image à partir de l'identifiant de l'activités, l'identifiant de l'utilisateur et le lien
        db.Picture.findOne({
            attributes: ['link','id_User','id_Activities'],
            where: {link: link, id_User: id_User, id_Activities: id_Activities}
        })
        .then(function(addPicture){

            //Vérifie que l'image n'existe pas déjà
            if(!addPicture) {

                    //Création d'une nouvelle image à partir des paramètres
                    var newPictures = db.Picture.create({
                    link: link,
                    id_User: id_User,
                    id_Activities: id_Activities
                    })
                    .then(function(newPicture) {
                        return res.status(201).json({'success': "Image posté !"});
                    })
                    .catch(function(err) {
                    return res.status(500).json({'error': 'Erreur lors du poste de l\'image !'});
                    });
            } else {
                return res.status(409).json({'error': 'Vous avez déjà posté cette image !'});
            }
        })
        .catch(function(err) {
            return res.status(500).json({ 'error': 'Impossible de vérifier l\'image!'});
        });
    } else { 
        return res.status(500).json({ 'error': 'Vous n\'avez pas la permission de poster cette image !'});
    }
    },
    pictureRemove: async function(req, res){

        //Récupération des paramètres
        var token = req.header('token');
        var id = req.body.id;
        decryptedToken = jwt.decode(token);
        id_Rank = decryptedToken.userRank;
        userId = decryptedToken.userId;

        //Récupération des informations d'une image à partir de son identifiant
        db.Picture.findOne({
            attributes: ['id','link','id_User','id_Activities'],
            where: {id: id}
        })
        .then(async function(removePicture){

            //Vérifie si l'image existe bien
            if(removePicture) {
                
                //Vérifie si l'utilisateur qui veut supprimé cette photo est bien celui qui l'a posté
                if(removePicture.id_User == userId) {

                    //Module qui permet de supprimer tous les commentaires de chaque image grâce à son identifiant
                    await delAllComments(removePicture.id);
                    //Module qui permet de supprimer tous les likes de chaque image grâce à son identifiant
                    await delAllLike(removePicture.id);

                        //Suppression de l'image grâce à son identifiant
                        db.Picture.destroy({
                            where: {id: id}
                            })
                            .then(function(commentRemove) {
                                return res.status(201).json({'success': "Image retiré !"});
                            })
                            .catch(function(err) {
                            return res.status(500).json({'error': 'Erreur lors de la suppréssion de l\'image !'});
                            });
                    
                //Vérifie si l'utilisateur qui veut supprimé cette photo est au moins staff
                } else if(id_Rank >= 2) {

                    //Module qui permet de supprimer tous les commentaires de chaque image grâce à son identifiant
                    await delAllComments(removePicture.id);
                    //Module qui permet de supprimer tous les likes de chaque image grâce à son identifiant
                    await delAllLike(removePicture.id);

                    //Module qui permet de supprimer tous les likes de chaque image grâce à son identifiant
                        db.Picture.destroy({
                            where: {id: id}
                            })
                            .then(function(commentRemove) {
                                return res.status(201).json({'success': "Image retiré !"});
                            })
                            .catch(function(err) {
                            return res.status(500).json({'error': 'Erreur lors de la suppréssion de l\'image !'});
                            });

                } else {
                    return res.status(500).json({'error': 'Vous n\'avez pas la permissions de retirer cette image !'});
                }

            } else {
                return res.status(409).json({'error': 'Cette image n\'existe pas !'});
            }
        })
        .catch(function(err) {
            return res.status(500).json({ 'error': 'Impossible de supprimer l\'image !'});
        });
    },
    getAllPicture: async function(req, res){

        //Récupères les informations de toutes les activités
        db.Activities.findAll({
            attributes: ['id','title']
        })
        .then(async function(Activities){
            //Vérifie si il existe au moins une activité
            if(Activities) {

                if(Activities.length != 0) {

                    //Boucle pour récupérer toutes les photos de chaque activité
                    for(var i = 0; i < Activities.length; i++) {

                        //Module pour récupérer toutes les photos à partir de l'identifiant d'une activité
                        AllPictures = await getAllPicture(Activities[i].id);

                        //Vérifie si il y a au moins une photo
                        if(AllPictures.length != 0){
                            for(var j = 0; j < AllPictures.length; j++){

                                //Module qui récupère les informations d'un utilisateur
                                userPicture = await nameofuser(AllPictures[j].id_User);

                                AllPictures[j] = {
                                    name: Activities[i].title,
                                    id: AllPictures[j].id,
                                    link: AllPictures[j].link,
                                    userLastname: userPicture[0],
                                    userFirstname: userPicture[1],
                                    userMail: userPicture[2]
                                }

                            }
                        }

                        Activities[i] = {
                            id: Activities[i].id,
                            pictures: AllPictures
                        }
                    }
                }

                //Retourne en json toutes les photos de chaque activité
                return res.status(200).json({Activities});

            } else {
                return res.status(409).json({'error': 'Aucun event !'});
            }

        })
        .catch(err => {
            return res.status(500).json({'error': 'Impossible de vérifier les events !'});
        });
    },
    getLike: function(req, res){

        //Récupération des paramètres
        var token = req.header('token');
        var id_Picture = req.query.id_Picture;
        decryptedToken = jwt.decode(token);
        id_Rank = decryptedToken.userRank;
        id_User = decryptedToken.userId;

        //Vérifie si l'utilisateur est au moins étudiant sur le site
        if(id_Rank >= 1) {

            //Récupération des informations d'un like à partir de l'identifiant d'un utilisateur et l'identifiant d'une image
            db.Like.findOne({
                attributes: ['id_User','id_Picture'],
                where: {id_User: id_User, id_Picture: id_Picture}
            })
            .then(function(like){

                //Vérifie si le like existe bien
                if(like) {
                    return res.status(201).json({'success': "OK"});
                } else {
                    return res.status(409).json({'error': 'Pas like !'});
                }
            })
            .catch(function(err) {
                return res.status(500).json({ 'error': 'Impossible de vérifier le like !'});
            });
        } else { 
            return res.status(500).json({ 'error': 'Vous n\'avez pas la permission de liker !'});
        }

    },
    getAllLike: function(req, res){

        //Récupération des paramètres
        var id_Picture = req.query.id_Picture;

            //Récupères les informations de tous les likes d'une photo
            db.Like.findAll({
                attributes: ['id_User','id_Picture'],
                where: {id_Picture: id_Picture}
            })
            .then(function(AllLike){

                //Vérifie si il y a au moins un like sur cette photo
                if(AllLike) {
                    return res.status(201).json({AllLike});
                } else {
                    return res.status(409).json({'error': 'Pas de like !'});
                }
            })
            .catch(function(err) {
                return res.status(500).json({ 'error': 'Impossible de vérifier les likes !'});
            });
    },
    like: function(req, res){

        //Récupération des paramètres
        var token = req.header('token');
        var id_Picture = req.body.id_Picture;
        decryptedToken = jwt.decode(token);
        id_Rank = decryptedToken.userRank;
        id_User = decryptedToken.userId;

        //Vérifie si l'utilisateur est au moins étudiant sur le site
        if(id_Rank >= 1) {

        //Récupération des information de like de l'utilisateur à partir de son identifiant et de l'identifiant de l'activité
        db.Like.findOne({
            attributes: ['id_User','id_Picture'],
            where: {id_User: id_User, id_Picture: id_Picture}
        })
        .then(function(like){

            //Vérifie si l'utilisateur n'a pas déjà liké cette photo
            if(!like) {
                    //Ajoute le like avec l'identifiant de l'utilisateur et l'identifiant de l'activité
                    var newRegister = db.Like.create({
                    id_User: id_User,
                    id_Picture: id_Picture
                    })
                    .then(function(newLike) {
                        return res.status(201).json({'success': "L\'image a bien été like !"});
                    })
                    .catch(function(err) {
                    return res.status(500).json({'error': 'Erreur lors du like'});
                    });
            } else {
                return res.status(409).json({'error': 'Vous avez déjà liké cette event !'});
            }
        })
        .catch(function(err) {
            return res.status(500).json({ 'error': 'Impossible de vérifier le like !'});
        });
    } else { 
        return res.status(500).json({ 'error': 'Vous n\'avez pas la permission de liker !'});
    }

    },
    unlike: function(req, res){

        //Récupération des paramètres
        var token = req.header('token');
        var id_Picture = req.body.id_Picture;
        decryptedToken = jwt.decode(token);
        id_Rank = decryptedToken.userRank;
        id_User = decryptedToken.userId;

        //Vérifie si l'utilisateur est au moins étudiant sur le site
        if(id_Rank >= 1) {

        //Récupération des informations des likes d'un utilisateurs à partir de son identifiant et de l'identifiant de l'activité
        db.Like.findOne({
            attributes: ['id_User','id_Picture'],
            where: {id_User: id_User, id_Picture: id_Picture}
        })
        .then(function(unlike){

            //Vérifie si le joueur à liké cette activités
            if(unlike) {
                    //Détruis le like à partir de l'identifiant de l'utilisateur et l'identifiant de l'activités
                    db.Like.destroy({
                    where: {id_User: id_User, id_Picture: id_Picture}
                    })
                    .then(function(unregisters) {
                        return res.status(201).json({'success': "L\'image a bien été unlike !"});
                    })
                    .catch(function(err) {
                    return res.status(500).json({'error': 'Erreur lors du unlike !'});
                    });
            } else {
                return res.status(409).json({'error': 'Vous n\'avez pas like cette événement !'});
            }
        })
        .catch(function(err) {
            return res.status(500).json({ 'error': 'Impossible de vérifier le unlike !'});
        });
    } else { 
        return res.status(500).json({ 'error': 'Vous n\'avez pas la permission de unlike !'});
    }

    }
}