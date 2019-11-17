/**
 * @file shopController
 * @author EclipsioZ
 * @license GPL-3.0
 */

 // Importation de la librairie jwt
 var jwt = require('jsonwebtoken');

 // Importation du module getAllPicture
const  getAllProduct = require('../utils/getAllProduct.js');

 // Importation du module delAllContains
 const  delAllContains = require('../utils/delAllContains.js');

 // Importation du module getProduct
 const  getProduct = require('../utils/getProduct.js');

 // Importation de la bdd
 const db = require('../models');

 // Définition des routes du shop
 module.exports = {
    getCart: function(req, res){

        //Récupération des paramètres
        var token = req.header('token');
        decryptedToken = jwt.decode(token);
        id_Rank = decryptedToken.userRank;
        id_User = decryptedToken.userId;

        //Vérifie si l'utilisateur est au moins étudiant sur le site
        if(id_Rank >= 1) {
            //Récupère le panier d'un utilisateur à partir de son propre identifiant
            db.Cart.findOne({
                attributes: ['id','id_User'],
                where: {id_User: id_User}
            })
            .then(function(getCart){

                //Récupère tous le contenu de son panier
                db.Contains.findAll({
                    attributes: ['id_Cart','id_Product','quantity'],
                    where: {id_Cart: getCart.id}
                })
                .then(async function(cart){

                    for(i = 0; i < cart.length; i++){

                        //Apelle le module getProduct pour permettre de récupérer toutes les informations des produits
                        var product = await getProduct(cart[i].id_Product);

                        cart[i] = {
                            id_Cart: cart[i].id_Cart,
                            quantity: cart[i].quantity,
                            product: product
                        }
                    }

                    //Renvoie une réponse avec le contenu du panier
                    return res.status(200).json({cart});

                })
                .catch(function(err){
                    return res.status(409).json({'error': 'Le panier est vide !'});
                })
            })
            .catch(function(err){
                return res.status(500).json({ 'error': 'Impossible de vérifier le panier !'});
            })
        } else {
            return res.status(500).json({ 'error': 'Vous devez être connecté pour accéder au panier !'});
        }
    },
    getIdCart: function(req, res){

        //Récupération des paramètres
        var token = req.header('token');
        decryptedToken = jwt.decode(token);
        id_Rank = decryptedToken.userRank;
        id_User = decryptedToken.userId;

        //Vérifie si l'utilisateur à au moins le rang étudiant
        if(id_Rank >= 1) {

            //Récupère le panier de l'utilisateur
            db.Cart.findOne({
                attributes: ['id','id_User'],
                where: {id_User: id_User}
            })
            .then(function(getCart){

                    cart = getCart.id;

                    //Renvoie une réponse avec l'identifiant du panier de l'utilisateur
                    return res.status(200).json({cart});
            })
            .catch(function(err){
                return res.status(500).json({ 'error': 'Impossible de vérifier le panier !'});
            })
        } else {
            return res.status(500).json({ 'error': 'Vous devez être connecté pour accéder au panier !'});
        }
    },
    addCart: function(req, res){

        //Récupération des paramètres
        var token = req.header('token');
        decryptedToken = jwt.decode(token);
        id_Rank = decryptedToken.userRank;
        id_User = decryptedToken.userId;

        //Vérifie si un utilisateur n'a pas déjà un panier à partir de son identifiant
        db.Cart.findOne({
            attributes: ['id','id_User'],
            where: {id_User: id_User}
        })
        .then(function(createCart){

            //Si l'utilisateur n'a pas de panier, on lui en créé un
            if(!createCart) {
                    var createCarts = db.Cart.create({
                    id_User: id_User
                    })
                    .then(function(newCart) {
                        return res.status(201).json({'success': "Panier créé !"});
                    })
                    .catch(function(err) {
                        console.log(err)
                    return res.status(500).json({'error': 'Erreur lors de la création du panier !'});
                    });
            } else {
                return res.status(409).json({'error': 'Vous avez déjà un panier !'});
            }
        })
        .catch(function(err) {
            return res.status(500).json({ 'error': 'Impossible de vérifier le panier !'});
        });
    },
    delCart: function(req, res){

        //Récupération des paramètres
        var token = req.header('token');
        decryptedToken = jwt.decode(token);
        id_Rank = decryptedToken.userRank;
        id_User = decryptedToken.userId;

        //On vérifie si l'utilisateur a bien un panié
        db.Cart.findOne({
            attributes: ['id','id_User'],
            where: {id_User: id_User}
        })
        .then(async function(deleteCart){

            if(deleteCart) {
                //On supprime le contenu du panier grâce à son identifiant
                await delAllContains(deleteCart.id);
                    //Suppression du panier à partir de son identifiant
                    var deleteCart = db.Cart.destroy({
                        where: {id: deleteCart.id}
                    })
                    .then(function(delCart) {
                        return res.status(201).json({'success': "Panier supprimé !"});
                    })
                    .catch(function(err) {
                        console.log(err)
                    return res.status(500).json({'error': 'Erreur lors de la suppression du panier !'});
                    });
            } else {
                return res.status(409).json({'error': 'Vous n\'avez pas de panier !'});
            }
        })
        .catch(function(err) {
            return res.status(500).json({ 'error': 'Impossible de vérifier le panier !'});
        });
    },
    addProductToCart: function(req, res){

       //Récupération des paramètres
        var token = req.header('token');
        id_Cart = req.body.id_Cart;
        id_Product = req.body.id_Product;
        quantity = req.body.quantity;
        decryptedToken = jwt.decode(token);
        id_Rank = decryptedToken.userRank;
        id_User = decryptedToken.userId;

        //Vérifie si l'utilisateur est au moins étudiant sur le site
        if(id_Rank >= 1) {
            //Vérifie si la saisie est bien un nombre
            if(isNaN(quantity)) return res.status(500).json({'error': 'La saisie n\'est pas valide !'});

            //Vérifie si le nombre rentré est bien supérieure à 0
            if(quantity<= 0) return res.status(500).json({'error': 'La quantité doit être supérieure à 0 !'});

            //Récupére le contenu d'un panier à partir de l'identifiant du panier et l'identifiant d'un produit
            db.Contains.findOne({
                attributes: ['id_Cart','id_Product','quantity'],
                where: {id_Cart: id_Cart, id_Product: id_Product}
            })
            .then(function(addProduct){

                //Vérifie si le produit ne fait pas partie de ce panier
                if(!addProduct) {

                        //On rajoute dans le panier le produit avec sa quantité
                        var addProducts = db.Contains.create({
                        id_Cart: id_Cart,
                        id_Product: id_Product,
                        quantity
                        })
                        .then(function(newCart) {
                            return res.status(201).json({'success': "Produit ajouté !"});
                        })
                        .catch(function(err) {
                            console.log(err)
                        return res.status(500).json({'error': 'Erreur lors de l\'ajout du produit !'});
                        });
                } else {
                    
                    //On ajoute la quantité suplémentaire de produit mît dans le panier en rajoutant celle déjà existante avant
                    var quantities = parseInt(addProduct.quantity) + parseInt(quantity);

                    //On met à jour le panier avec la nouvelle quantité du produit
                    db.Contains.update({

                        id_Cart: id_Cart,
                        id_Product: id_Product,
                        quantity: quantities

                        },{where: {id_Cart: id_Cart, id_Product: id_Product}})
                        .then(function(upProduct) {
                            return res.status(201).json({'success': "Produit ajoutée!"});
                        })
                        .catch(function(err) {
                            console.log(err)
                        return res.status(500).json({'error': 'Erreur lors de l\'ajout du produit !'});
                        });

                }
            })
            .catch(function(err) {
                return res.status(500).json({ 'error': 'Vous n\'avez pas la permission d\'ajouter un produit au panier !'});
            });
        } else {

        }
    },
    delProductToCart: function(req, res){

        //Récupération des paramètres
        var token = req.header('token');
        id_Product = req.body.id_Product;
        decryptedToken = jwt.decode(token);
        id_Rank = decryptedToken.userRank;
        id_User = decryptedToken.userId;

        //Vérifie si l'utilisateur est au moins étudiant sur le site
        if(id_Rank >= 1) {

            //On récupère le panier d'un utilisateur à partir de son identifiant
            db.Cart.findOne({
                attributes: ['id','id_User'],
                where: {id_User: id_User}
            })
            .then(function(cart){
                //On récupère le contenu du panier à partir de son identifiant  
                db.Contains.findOne({
                    attributes: ['id_Cart','id_Product','quantity'],
                    where: {id_Cart: cart.id, id_Product: id_Product}
                })
                .then(function(delProduct){

                    //Vérifie si le produit est bien dans le panier
                    if(delProduct) {
                            //On supprime le produit du panier à partir de son identifiant
                            var delProduct = db.Contains.destroy({
                            where: {id_Product: id_Product}
                            })
                            .then(function(newCart) {
                                return res.status(201).json({'success': "Produit supprimé !"});
                            })
                            .catch(function(err) {
                                console.log(err)
                            return res.status(500).json({'error': 'Erreur lors de la supression du produit !'});
                            });
                    } else {

                            return res.status(500).json({'error': 'Ce produit ne fait partie de ce panier !'});

                    }
                })
                .catch(function(err) {
                    return res.status(500).json({ 'error': 'Vous n\'avez pas la permission de supprimer un produit du panier !'});
                });
            })
            .catch(function(err) {
                return res.status(500).json({ 'error': 'Impossible de vérifier le panier !'});
            });
        } else {
            return res.status(500).json({ 'error': 'Vous n\'avez pas la permission de supprimer un produit du panier !'});  
        }
    },
    getCategoriesAndProducts: function(req, res){

        //On récupère toutes les catégories
        db.Category.findAll({
            attributes: ['id','label']
        })
        .then(async function(Categories){

            //Vérifie si il existe au moins une catégorie
            if(Categories) {
                
                for(i=0; i < Categories.length; i++) {

                    //On appelle un module qui récupère tous les produits d'une catégorie à partir de son identifiant
                    var allProduct = await getAllProduct(Categories[i].id);

                    Categories[i] = {
                            id: Categories[i].id,
                            label: Categories[i].label,
                            products: allProduct
                        }
                }

                //On renvoie un json avec le nom et l'identifiant de chaque catégorie ainsi que l'ensemble des produits qui en font parties
                return res.status(200).json({Categories});

            } else {
                return res.status(409).json({'error': 'Il n\'y a aucune catégorie !'});
            }
        })
        .catch(function(err) {
            return res.status(500).json({ 'error': 'Impossible de vérifier les catégorie !'});
        });
    },
    getCategories: function(req, res){

        //Récupère toutes les catégories
        db.Category.findAll({
            attributes: ['id','label']
        })
        .then(async function(Categories){

            if(Categories) {

                //Renvoie un json avec tous le nom et identifiant de chaque catégorie
                return res.status(200).json({Categories});

            } else {
                return res.status(409).json({'error': 'Il n\'y a aucune catégorie !'});
            }
        })
        .catch(function(err) {
            return res.status(500).json({ 'error': 'Impossible de vérifier les catégorie !'});
        });
    },
    addCategory: function(req, res){

        //Récupération des paramètres
        var token = req.header('token');
        decryptedToken = jwt.decode(token);
        var label = req.body.label;
        id_Rank = decryptedToken.userRank;
        id_User = decryptedToken.userId;

        //Vérifie si l'utilisateur est au moins membre du BDE sur le site
        if(id_Rank >= 3){
            //Vérifie si le nom de la catégorie n'est pas déjà existant
            db.Category.findOne({
                attributes: ['id','label'],
                where: {label: label}
            })
            .then(function(createCategory){

                //On vérifie si il n'y a pas de catégorie avec ce nom
                if(!createCategory) {

                        //On créer une nouvelle catégorie
                        var createCategory = db.Category.create({
                        label: label
                        })
                        .then(function(newCategory) {
                            return res.status(201).json({'success': "catégorie créé !"});
                        })
                        .catch(function(err) {
                            console.log(err)
                        return res.status(500).json({'error': 'Erreur lors de la création de la catégorie !'});
                        });
                } else {
                    return res.status(409).json({'error': 'Vous avez déjà créé cette catégorie !'});
                }
            })
            .catch(function(err) {
                console.log(err)
                return res.status(500).json({ 'error': 'Impossible de vérifier la catégorie !'});
            });
        } else {
            return res.status(500).json({ 'error': 'Vous n\'avez pas la permission de créer une catégorie !'});
        }
    },
    updateCategory: function(req, res){

        //Récupération des paramètres
        var token = req.header('token');
        decryptedToken = jwt.decode(token);
        var id = req.body.id;
        var label = req.body.label;
        id_Rank = decryptedToken.userRank;
        id_User = decryptedToken.userId;

        //Vérifie si l'utilisateur est au moins membre du BDE sur le site
        if(id_Rank >= 3) {

            //Récupération des informations d'une catégorie à partir de son identifiant
            db.Category.findOne({
                attributes: ['id','label'],
                where: {id: id}
            })
            .then(function(updateCategory){

                //Vérifie si la catégorie existe bien
                if(updateCategory) {
                    //Met à jour la catégorie à partir des paramètres reçus
                    db.Category.update({
                        label: label
                        },{where: {id: id}})
                        .then(function(upCategory) {
                            return res.status(201).json({'success': "Catégorie modifiée!"});
                        })
                        .catch(function(err) {
                            console.log(err)
                        return res.status(500).json({'error': 'Erreur lors de la modification de la catégorie !'});
                        });
                } else {
                    return res.status(409).json({'error': 'Cette catégorie n\'existe pas !'});
                }
            })
            .catch(function(err) {
                console.log(err);
                return res.status(500).json({ 'error': 'Impossible de vérifier la catégorie !'});
            });
        } else {
            return res.status(500).json({ 'error': 'Vous n\'avez pas la permission de modifier une catégorie !'});
        }
    },
    delCategory: function(req, res){

        //Récupération des paramètres
        var token = req.header('token');
        decryptedToken = jwt.decode(token);
        var id = req.body.id;
        id_Rank = decryptedToken.userRank;
        id_User = decryptedToken.userId;

        //Vérifie si l'utilisateur est au moins membre du BDE sur le site
        if(id_Rank >= 3) {
            //On récupère une catégorie à partir de son identifiant
            db.Category.findOne({
                attributes: ['id','label'],
                where: {id: id}
            })
            .then(function(deleteCatagory){

                //Vérifie si la catégorie existe bien
                if(deleteCatagory) {

                        //Suppreison de la catégorie à partir de son identifiant
                        var deleteCatagory = db.Category.destroy({
                            where: {id: deleteCatagory.id}
                        })
                        .then(function(delCategory) {
                            return res.status(201).json({'success': "Catégorie supprimée !"});
                        })
                        .catch(function(err) {
                            console.log(err)
                        return res.status(500).json({'error': 'Erreur lors de la suppression de la catégorie !'});
                        });
                } else {
                    return res.status(409).json({'error': 'Cette catégorie n\'existe pas !'});
                }
            })
            .catch(function(err) {
                return res.status(500).json({ 'error': 'Impossible de vérifier la catégorie !'});
            });
        } else {
            return res.status(500).json({ 'error': 'Vous n\'avez pas la permission de supprimer une catégorie !'});  
        }
    },
    getProduct: function(req, res){

        //Récupération des paramètres
        var id = req.query.id;

        //On récupére les informations d'un produit à partir de son identifiant
        db.Product.findOne({
            attributes: ['id','label','description','picture','price','delevery_date','nb_sales','id_Center','id_Category'],
            where: {id: id}
        })
        .then(function(product){

            //Vérifie si le produit existe bien
            if(product) {
                return res.status(409).json({product});
            } else {
                return res.status(409).json({'error': 'Ce produit n\'existe pas !'});
            }
        })
        .catch(function(err) {
            return res.status(500).json({ 'error': 'Impossible de vérifier le produit !'});
        });
    },
    addProduct: function(req, res){

        //Récupération des paramètres
        var token = req.header('token');
        decryptedToken = jwt.decode(token);
        var label = req.body.label;
        var description = req.body.description;
        var picture = req.body.picture;
        var price = req.body.price;
        var delevery_date = req.body.delevery_date;
        var nb_sales = req.body.nb_sales;
        var id_Center = req.body.id_Center;
        var id_Category = req.body.id_Category;
        id_Rank = decryptedToken.userRank;
        id_User = decryptedToken.userId;

        //Vérifie si l'utilisateur est au moins membre du BDE sur le site
        if(id_Rank >= 3){

            //On vérifie si le produit n'existe pas déjà grâce à l'identifiant de la catégorie et le label du produit
            db.Product.findOne({
                attributes: ['id','label','description','picture','price','delevery_date','nb_sales','id_Center','id_Category'],
                where: {label: label, id_Category: id_Category}
            })
            .then(function(createProduct){

                //Vérifie si le produit n'existe pas
                if(!createProduct) {
                        //Créé un produit à partir des différents paramètres reçus
                        var createProduct = db.Product.create({
                        label: label,
                        description: description,
                        picture: picture,
                        price: price,
                        delevery_date: delevery_date,
                        nb_sales: nb_sales,
                        id_Center: id_Center,
                        id_Category: id_Category
                        })
                        .then(function(newProduct) {
                            return res.status(201).json({'success': "Produit créé !"});
                        })
                        .catch(function(err) {
                            console.log(err)
                        return res.status(500).json({'error': 'Erreur lors de la création du produit !'});
                        });
                } else {
                    return res.status(409).json({'error': 'Vous avez déjà créé ce produit !'});
                }
            })
            .catch(function(err) {
                console.log(err)
                return res.status(500).json({ 'error': 'Impossible de vérifier le produit !'});
            });
        } else {
            return res.status(500).json({ 'error': 'Vous n\'avez pas la permission de créer un produit !'});
        }
    },
    updateProduct: function(req, res){

        //Récupération des paramètres
        var token = req.header('token');
        decryptedToken = jwt.decode(token);
        var id = req.body.id;
        var label = req.body.label;
        var description = req.body.description;
        var picture = req.body.picture;
        var price = req.body.price;
        var delevery_date = req.body.delevery_date;
        var nb_sales = req.body.nb_sales;
        var id_Center = req.body.id_Center;
        var id_Category = req.body.id_Category;
        id_Rank = decryptedToken.userRank;
        id_User = decryptedToken.userId;

        //Vérifie si l'utilisateur est au moins membre du BDE sur le site
        if(id_Rank >= 3) {

            //On récupére les informations du produit à partir de son identifiant
            db.Product.findOne({
                attributes: ['id','label','description','picture','price','delevery_date','nb_sales','id_Center','id_Category'],
                where: {id: id}
            })
            .then(function(updateProduct){

                //On vérifie si le produit existe
                if(updateProduct) {
                    //On met à jour le produit grâce aux paramètres reçus à partir de son identifiant
                    db.Product.update({
                        label: label,
                        description: description,
                        picture: picture,
                        price: price,
                        delevery_date: delevery_date,
                        nb_sales: nb_sales,
                        id_Center: id_Center,
                        id_Category: id_Category

                        },{where: {id: id}})
                        .then(function(upProduct) {
                            return res.status(201).json({'success': "Produit modifiée!"});
                        })
                        .catch(function(err) {
                            console.log(err)
                        return res.status(500).json({'error': 'Erreur lors de la modification du produit !'});
                        });
                } else {
                    return res.status(409).json({'error': 'Ce produit n\'existe pas !'});
                }
            })
            .catch(function(err) {
                console.log(err);
                return res.status(500).json({ 'error': 'Impossible de vérifier le produit !'});
            });
        } else {
            return res.status(500).json({ 'error': 'Vous n\'avez pas la permission de modifier un produit !'});
        }
    },
    updateNbSalesProduct: function(req, res){

        //Récupération des paramètres
        var token = req.header('token');
        decryptedToken = jwt.decode(token);
        var id = req.body.id;
        var nb_sales = req.body.nb_sales;
        id_Rank = decryptedToken.userRank;
        id_User = decryptedToken.userId;

        //Vérifie si l'utilisateur est au moins membre du BDE sur le site
        if(id_Rank >= 3) {
            //On récupère les informations du nombre de ventes d'un produit à partir de son identifiant
            db.Product.findOne({
                attributes: ['id','nb_sales'],
                where: {id: id}
            })
            .then(function(updateProduct){

                //On additionne le nombre de produit vendu et ceux rentré en paramètre
                nb = parseInt(nb_sales) + parseInt(updateProduct.nb_sales);

                //On vérifie si le produit existe bien
                if(updateProduct) {
                    //On met à jour la quantité de ce produit vendu
                    db.Product.update({
                        nb_sales: nb
                        },{where: {id: id}})
                        .then(function(upProduct) {
                            return res.status(201).json({'success': "Nombre de ventes ajouté !"});
                        })
                        .catch(function(err) {
                            console.log(err)
                        return res.status(500).json({'error': 'Erreur lors de la modification du produit !'});
                        });
                } else {
                    return res.status(409).json({'error': 'Ce produit n\'existe pas !'});
                }
            })
            .catch(function(err) {
                console.log(err);
                return res.status(500).json({ 'error': 'Impossible de vérifier le produit !'});
            });
        } else {
            return res.status(500).json({ 'error': 'Vous n\'avez pas la permission de modifier un produit !'});
        }
    },
    deleteProduct: function(req, res){

        //Récupération des paramètres
        var token = req.header('token');
        decryptedToken = jwt.decode(token);
        var id = req.body.id;
        id_Rank = decryptedToken.userRank;
        id_User = decryptedToken.userId;

        //Vérifie si l'utilisateur est au moins membre du BDE sur le site
        if(id_Rank >= 3) {
            //Récupération des informations d'un produit à partir de son identifiant
            db.Product.findOne({
                attributes: ['id','label'],
                where: {id: id}
            })
            .then(function(deleteProduct){

                //On vérifie si le produit existe bien
                if(deleteProduct) {
                        //On supprime le produit à partir de son identifiant
                        var deleteProduct = db.Product.destroy({
                            where: {id: deleteProduct.id}
                        })
                        .then(function(delProduct) {
                            return res.status(201).json({'success': "Produit supprimée !"});
                        })
                        .catch(function(err) {
                            console.log(err)
                        return res.status(500).json({'error': 'Erreur lors de la suppression du produit !'});
                        });
                } else {
                    return res.status(409).json({'error': 'Cet produit n\'existe pas !'});
                }
            })
            .catch(function(err) {
                return res.status(500).json({ 'error': 'Impossible de vérifier le produit !'});
            });
        } else {
            return res.status(500).json({ 'error': 'Vous n\'avez pas la permission de supprimer un produit !'});  
        }
    },

 }