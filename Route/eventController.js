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

// Importation du module delAllRegister
const delAllRegister = require('../utils/delAllRegister.js');

// Définition des routes des events
module.exports = {
    get: async function(req, res) {

        var token = req.header('token');
        var id_Activities = req.query.id_Activities;
        if(token == 0) return res.status(500).json({'error': "Erreur liés au token !"});
        decryptedToken = jwt.decode(token);
        if(decryptedToken.userRank == null) return res.status(500).json({'error': "Erreur liés au token !"});
        id_Rank = decryptedToken.userRank;

        if(id_Rank >= 1) {

            var activity = await getActivities(id_Activities);

            if(activity == false) return res.status(500).json({'error': "Cet id n'existe pas !"});

            var pictures = await getAllPicture(activity.id);

            if(pictures.length == 0) return res.status(200).json({activity});
            
            for(i = 0; i < pictures.length; i++){
                
                var comments = await getAllComments(pictures[i].id);

                if(comments.length != 0) {

                for(j = 0; j < comments.length; j++){

                    var commentsOfComments = await getAllCommentsOfComments(comments[j].id);

                    if(commentsOfComments.length != 0) {

                        for(v = 0; v < commentsOfComments.length; v++){

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
                    comments: comments
                }

            }
            return res.status(200).json({activity, pictures});
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
    add: function(req, res){

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

        if(id_Rank >= 3) {

        db.Activities.findOne({
            attributes: ['title','description','picture','begin_date','price','id_Center'],
            where: {title: title, description: description, picture: picture, begin_date: begin_date, price: price, id_Center: id_Center}
        })
        .then(function(addActivities){

            if(!addActivities) {
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

        if(id_Rank >= 3) {

        db.Activities.findOne({
            attributes: ['id','title','description','picture','begin_date','price','id_Center'],
            where: {id: id}
        })
        .then(function(updateActivities){

            if(updateActivities) {
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

        var token = req.header('token');
        var id = req.body.id;
        decryptedToken = jwt.decode(token);
        id_Rank = decryptedToken.userRank;
        userId = decryptedToken.userId;

        db.Activities.findOne({
            attributes: ['id','id_User'],
            where: {id: id}
        })
        .then(async function(removeActivities){

            if(removeActivities) {

                if(id_Rank >= 2) {

                    var AllRegisterDel = await delAllRegister(removeActivities.id);
                    var allPictureDel = await delAllPictures(removeActivities.id);

                    if(allPictureDel == true){
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

        var id_Activities = req.query.id_Activities;

        db.Register.findAll({
            attributes: ['id_User'],
            where: {id_Activities: id_Activities}
        })
        .then(function(register){

            if(register) {
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

        var token = req.header('token');
        var id_Activities = req.body.id_Activities;
        decryptedToken = jwt.decode(token);
        id_Rank = decryptedToken.userRank;
        id_User = decryptedToken.userId;

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
            return res.status(500).json({ 'error': 'Impossible de vérifier l\'enregistrement !'});
        });
    } else { 
        return res.status(500).json({ 'error': 'Vous n\'avez pas la permission de vous abonner !'});
    }

    },
    unsubscribe: function(req, res){

        var token = req.header('token');
        var id_Activities = req.body.id_Activities;
        decryptedToken = jwt.decode(token);
        id_Rank = decryptedToken.userRank;
        id_User = decryptedToken.userId;

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
            return res.status(500).json({ 'error': 'Impossible de vérifier le désenregistrement !'});
        });
    } else { 
        return res.status(500).json({ 'error': 'Vous n\'avez pas la permission de vous désabonner !'});
    }

    },
    getComment: function(req, res){

        var token = req.header('token');
        var id = req.query.id;
        decryptedToken = jwt.decode(token);
        id_Rank = decryptedToken.userRank;
        id_User = decryptedToken.userId;

        if(id_Rank >= 1) {

            db.Comments.findOne({
                attributes: ['id','content','id_User','id_Picture','id_Comments'],
                where: {id: id}
            })
            .then(async function(getComment){

                if(getComment) {

                    var commentsOfComments = await getAllCommentsOfComments(getComment.id);

                    if(commentsOfComments.length != 0) {

                        for(i = 0; i < commentsOfComments.length; i++){

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

        var token = req.header('token');
        var content = req.body.content;
        var id_Picture = req.body.id_Picture;
        var id_Comments = req.body.id_Comments;
        decryptedToken = jwt.decode(token);
        id_Rank = decryptedToken.userRank;
        id_User = decryptedToken.userId;

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
            console.log(err)
            return res.status(500).json({ 'error': 'Impossible de vérifier ce commentaire !'});
        });
    } else { 
        return res.status(500).json({ 'error': 'Vous n\'avez pas la permission de poster ce commentaire !'});
    }

    },
    commentsUpdate: function(req, res){

        var token = req.header('token');
        var id = req.body.id;
        var content = req.body.content;
        decryptedToken = jwt.decode(token);
        id_Rank = decryptedToken.userRank;
        id_User = decryptedToken.userId;


        db.Comments.findOne({
            attributes: ['id','content','id_User','id_Picture','id_Comments'],
            where: {id: id}
        })
        .then(function(updateComments){

            if(updateComments) {

                if(updateComments.id_User == id_User) { 

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

                } else if(id_Rank >= 2) {
                    
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

        var token = req.header('token');
        var id = req.body.id;
        decryptedToken = jwt.decode(token);
        id_Rank = decryptedToken.userRank;
        userId = decryptedToken.userId;

        db.Comments.findOne({
            attributes: ['id','content','id_User','id_Picture','id_Comments'],
            where: {id: id}
        })
        .then(async function(removeComment){

            if(removeComment) {
                    
                if(removeComment.id_User == userId) {

                    var removeCommentsOfComments = await delAllCommentsOfComments(removeComment.id);

                    db.Comments.destroy({
                        where: {id: id}
                        })
                        .then(function(commentRemove) {
                            return res.status(201).json({'success': "Commentaires retiré !"});
                        })
                        .catch(function(err) {
                        return res.status(500).json({'error': 'Erreur lors de la retiration du commentaire !'});
                        });
                    
                } else if(id_Rank >= 2) {

                    var removeCommentsOfComments = await delAllCommentsOfComments(removeComment.id);

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

        var token = req.header('token');
        var link = req.body.link;
        var id_Activities = req.body.id_Activities;
        decryptedToken = jwt.decode(token);
        id_Rank = decryptedToken.userRank;
        id_User = decryptedToken.userId;

        if(id_Rank >= 1) {

        db.Picture.findOne({
            attributes: ['link','id_User','id_Activities'],
            where: {link: link, id_User: id_User, id_Activities: id_Activities}
        })
        .then(function(addPicture){

            if(!addPicture) {
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

        var token = req.header('token');
        var id = req.body.id;
        decryptedToken = jwt.decode(token);
        id_Rank = decryptedToken.userRank;
        userId = decryptedToken.userId;

        db.Picture.findOne({
            attributes: ['id','link','id_User','id_Activities'],
            where: {id: id}
        })
        .then(async function(removePicture){

            if(removePicture) {
                    
                if(removePicture.id_User == userId) {

                    await delAllComments(removePicture.id);

                        db.Picture.destroy({
                            where: {id: id}
                            })
                            .then(function(commentRemove) {
                                return res.status(201).json({'success': "Image retiré !"});
                            })
                            .catch(function(err) {
                            return res.status(500).json({'error': 'Erreur lors de la retiration de l\'image !'});
                            });
                    
                } else if(id_Rank >= 2) {

                    await delAllComments(removePicture.id);

                        db.Picture.destroy({
                            where: {id: id}
                            })
                            .then(function(commentRemove) {
                                return res.status(201).json({'success': "Image retiré !"});
                            })
                            .catch(function(err) {
                            return res.status(500).json({'error': 'Erreur lors de la retiration de l\'image !'});
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

        db.Activities.findAll({
            attributes: ['id','title']
        })
        .then(async function(Activities){
            if(Activities) {

                if(Activities.length != 0) {
                    for(var i = 0; i < Activities.length; i++) {

                        AllPictures = await getAllPicture(Activities[i].id);
                        console.log(AllPictures)
                        if(AllPictures.length != 0){
                            for(var j = 0; j < AllPictures.length; j++){

                                userPicture = await nameofuser(AllPictures[j].id_User);

                                AllPictures[j] = {
                                    id: AllPictures[j].id,
                                    link: AllPictures[j].link,
                                    userLastname: userPicture[0],
                                    userFirstname: userPicture[1],
                                    userMail: userPicture[2]
                                }

                            }
                        }

                        Activities[i] = {
                            name: Activities[i].title,
                            pictures: AllPictures
                        }
                    }
                }

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

        var token = req.header('token');
        var id_Picture = req.query.id_Picture;
        decryptedToken = jwt.decode(token);
        id_Rank = decryptedToken.userRank;
        id_User = decryptedToken.userId;

        if(id_Rank >= 1) {

            db.Like.findOne({
                attributes: ['id_User','id_Picture'],
                where: {id_User: id_User, id_Picture: id_Picture}
            })
            .then(function(like){

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

        var id_Picture = req.query.id_Picture;

            db.Like.findAll({
                attributes: ['id_User','id_Picture'],
                where: {id_Picture: id_Picture}
            })
            .then(function(AllLike){

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

        var token = req.header('token');
        var id_Picture = req.body.id_Picture;
        decryptedToken = jwt.decode(token);
        id_Rank = decryptedToken.userRank;
        id_User = decryptedToken.userId;

        if(id_Rank >= 1) {

        db.Like.findOne({
            attributes: ['id_User','id_Picture'],
            where: {id_User: id_User, id_Picture: id_Picture}
        })
        .then(function(like){

            if(!like) {
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

        var token = req.header('token');
        var id_Picture = req.body.id_Picture;
        decryptedToken = jwt.decode(token);
        id_Rank = decryptedToken.userRank;
        id_User = decryptedToken.userId;

        if(id_Rank >= 1) {

        db.Like.findOne({
            attributes: ['id_User','id_Picture'],
            where: {id_User: id_User, id_Picture: id_Picture}
        })
        .then(function(unlike){

            if(unlike) {
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