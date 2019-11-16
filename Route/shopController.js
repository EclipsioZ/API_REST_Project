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

        var token = req.header('token');
        decryptedToken = jwt.decode(token);
        id_Rank = decryptedToken.userRank;
        id_User = decryptedToken.userId;

        if(id_Rank >= 1) {
            db.Cart.findOne({
                attributes: ['id','id_User'],
                where: {id_User: id_User}
            })
            .then(function(getCart){

                db.Contains.findAll({
                    attributes: ['id_Cart','id_Product','quantity'],
                    where: {id_Cart: getCart.id}
                })
                .then(async function(cart){

                    for(i = 0; i < cart.length; i++){

                        var product = await getProduct(cart[i].id_Product);

                        cart[i] = {
                            id_Cart: cart[i].id_Cart,
                            quantity: cart[i].quantity,
                            product: product
                        }
                    }

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

        var token = req.header('token');
        decryptedToken = jwt.decode(token);
        id_Rank = decryptedToken.userRank;
        id_User = decryptedToken.userId;

        if(id_Rank >= 1) {
            db.Cart.findOne({
                attributes: ['id','id_User'],
                where: {id_User: id_User}
            })
            .then(function(getCart){

                    cart = getCart.id;
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

        var token = req.header('token');
        decryptedToken = jwt.decode(token);
        id_Rank = decryptedToken.userRank;
        id_User = decryptedToken.userId;

        db.Cart.findOne({
            attributes: ['id','id_User'],
            where: {id_User: id_User}
        })
        .then(function(createCart){

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

        var token = req.header('token');
        decryptedToken = jwt.decode(token);
        id_Rank = decryptedToken.userRank;
        id_User = decryptedToken.userId;

        db.Cart.findOne({
            attributes: ['id','id_User'],
            where: {id_User: id_User}
        })
        .then(async function(deleteCart){

            await delAllContains(deleteCart.id);

            if(deleteCart) {
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

        var token = req.header('token');
        id_Cart = req.body.id_Cart;
        id_Product = req.body.id_Product;
        quantity = req.body.quantity;
        decryptedToken = jwt.decode(token);
        id_Rank = decryptedToken.userRank;
        id_User = decryptedToken.userId;

        if(id_Rank >= 1) {
            if(isNaN(quantity)) return res.status(500).json({'error': 'La saisie n\'est pas valide !'});
            if(quantity<= 0) return res.status(500).json({'error': 'La quantité doit être supérieure à 0 !'});
            db.Contains.findOne({
                attributes: ['id_Cart','id_Product','quantity'],
                where: {id_Cart: id_Cart, id_Product: id_Product}
            })
            .then(function(addProduct){

                if(!addProduct) {
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
                    

                    var quantities = parseInt(addProduct.quantity) + parseInt(quantity);
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

        var token = req.header('token');
        id_Product = req.body.id_Product;
        decryptedToken = jwt.decode(token);
        id_Rank = decryptedToken.userRank;
        id_User = decryptedToken.userId;

        if(id_Rank >= 1) {

            db.Cart.findOne({
                attributes: ['id','id_User'],
                where: {id_User: id_User}
            })
            .then(function(cart){
                db.Contains.findOne({
                    attributes: ['id_Cart','id_Product','quantity'],
                    where: {id_Cart: cart.id, id_Product: id_Product}
                })
                .then(function(delProduct){

                    if(delProduct) {
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

        db.Category.findAll({
            attributes: ['id','label']
        })
        .then(async function(Categories){

            if(Categories) {
                
                for(i=0; i < Categories.length; i++) {

                    var allProduct = await getAllProduct(Categories[i].id);

                    Categories[i] = {
                            id: Categories[i].id,
                            label: Categories[i].label,
                            products: allProduct
                        }
                }

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

        db.Category.findAll({
            attributes: ['id','label']
        })
        .then(async function(Categories){

            if(Categories) {

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

        var token = req.header('token');
        decryptedToken = jwt.decode(token);
        var label = req.body.label;
        id_Rank = decryptedToken.userRank;
        id_User = decryptedToken.userId;

        if(id_Rank >= 3){
            db.Category.findOne({
                attributes: ['id','label'],
                where: {label: label}
            })
            .then(function(createCategory){

                if(!createCategory) {
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

        var token = req.header('token');
        decryptedToken = jwt.decode(token);
        var id = req.body.id;
        var label = req.body.label;
        id_Rank = decryptedToken.userRank;
        id_User = decryptedToken.userId;

        if(id_Rank >= 3) {
            db.Category.findOne({
                attributes: ['id','label'],
                where: {id: id}
            })
            .then(function(updateCategory){

                if(updateCategory) {
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

        var token = req.header('token');
        decryptedToken = jwt.decode(token);
        var id = req.body.id;
        id_Rank = decryptedToken.userRank;
        id_User = decryptedToken.userId;

        if(id_Rank >= 3) {
            db.Category.findOne({
                attributes: ['id','label'],
                where: {id: id}
            })
            .then(function(deleteCatagory){

                if(deleteCatagory) {
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

        var id = req.query.id;

        db.Product.findOne({
            attributes: ['id','label','description','picture','price','delevery_date','nb_sales','id_Center','id_Category'],
            where: {id: id}
        })
        .then(function(product){

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

        if(id_Rank >= 3){
            db.Product.findOne({
                attributes: ['id','label','description','picture','price','delevery_date','nb_sales','id_Center','id_Category'],
                where: {label: label, id_Category: id_Category}
            })
            .then(function(createProduct){

                if(!createProduct) {
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

        if(id_Rank >= 3) {
            db.Product.findOne({
                attributes: ['id','label','description','picture','price','delevery_date','nb_sales','id_Center','id_Category'],
                where: {id: id}
            })
            .then(function(updateProduct){

                if(updateProduct) {
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

        var token = req.header('token');
        decryptedToken = jwt.decode(token);
        var id = req.body.id;
        var nb_sales = req.body.nb_sales;
        id_Rank = decryptedToken.userRank;
        id_User = decryptedToken.userId;

        if(id_Rank >= 3) {
            db.Product.findOne({
                attributes: ['id','nb_sales'],
                where: {id: id}
            })
            .then(function(updateProduct){

                nb = parseInt(nb_sales) + parseInt(updateProduct.nb_sales);
                if(updateProduct) {
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

        var token = req.header('token');
        decryptedToken = jwt.decode(token);
        var id = req.body.id;
        id_Rank = decryptedToken.userRank;
        id_User = decryptedToken.userId;

        if(id_Rank >= 3) {
            db.Product.findOne({
                attributes: ['id','label'],
                where: {id: id}
            })
            .then(function(deleteProduct){

                if(deleteProduct) {
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