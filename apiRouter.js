/**
 * @file apirouter
 * @author EclipsioZ
 * @license GPL-3.0
 */

// Importation de la librairie express
const express = require('express');

// Importation de l'userController
const usersCtrl = require('./Route/userController.js');

// Importation du centerController
const paramCtrl = require('./Route/paramController.js');

// Importation du centerController
const eventCtrl = require('./Route/eventController.js');

// Importation du centerController
const tokenCtrl = require('./Route/tokenController.js');

// Importation du centerController
const shopCtrl = require('./Route/shopController.js');

// Router

exports.router = (function() {

    var apiRouter = express.Router();

    // User
    apiRouter.route('/users/register/').post(usersCtrl.register);
    apiRouter.route('/users/login/').post(usersCtrl.login);
    apiRouter.route('/users/update/').post(usersCtrl.update);
    apiRouter.route('/users/getAll/').get(usersCtrl.getAll);
    apiRouter.route('/users/get/').get(usersCtrl.get);

    //Paramètres
    apiRouter.route('/centers').get(paramCtrl.centers);
    apiRouter.route('/recurrences').get(paramCtrl.recurrence);
    apiRouter.route('/states').get(paramCtrl.state);
    apiRouter.route('/preferences').get(paramCtrl.preference);
    apiRouter.route('/updatePreference').post(paramCtrl.updatePreference);
    apiRouter.route('/categories').get(paramCtrl.category);


    //Shop

        //Cart
        apiRouter.route('/shop/getCart').get(shopCtrl.getCart);
        apiRouter.route('/shop/getIdCart').get(shopCtrl.getIdCart);
        apiRouter.route('/shop/createCart').post(shopCtrl.addCart);
        apiRouter.route('/shop/deleteCart').post(shopCtrl.delCart);
        apiRouter.route('/shop/addProductToCart').post(shopCtrl.addProductToCart);
        apiRouter.route('/shop/delProductToCart').post(shopCtrl.delProductToCart);

        //Category
        apiRouter.route('/shop/getCategories').get(shopCtrl.getCategories);
        apiRouter.route('/shop/getCategoriesAndProducts').get(shopCtrl.getCategoriesAndProducts);
        apiRouter.route('/shop/createCategory').post(shopCtrl.addCategory);
        apiRouter.route('/shop/deleteCategory').post(shopCtrl.delCategory);
        apiRouter.route('/shop/updateCategory').post(shopCtrl.updateCategory);
        
        //Product
        apiRouter.route('/shop/getProduct').get(shopCtrl.getProduct);
        apiRouter.route('/shop/createProduct').post(shopCtrl.addProduct);
        apiRouter.route('/shop/updateProduct').post(shopCtrl.updateProduct);
        apiRouter.route('/shop/updateNbSalesProduct').post(shopCtrl.updateNbSalesProduct);
        apiRouter.route('/shop/deleteProduct').post(shopCtrl.deleteProduct);

    //Event

        //Activities
        apiRouter.route('/events/all').get(eventCtrl.all);
        apiRouter.route('/events/get').get(eventCtrl.get);
        apiRouter.route('/events/add').post(eventCtrl.add);
        apiRouter.route('/events/update').post(eventCtrl.update);
        apiRouter.route('/events/del').post(eventCtrl.del);

        //Subscription
        apiRouter.route('/events/getSubscribe').get(eventCtrl.getSubscribe);
        apiRouter.route('/events/subscribe').post(eventCtrl.subscribe);
        apiRouter.route('/events/unsubscribe').post(eventCtrl.unsubscribe);

        //Comments
        apiRouter.route('/events/getComment').get(eventCtrl.getComment);
        apiRouter.route('/events/addComment').post(eventCtrl.commentsAdd);
        apiRouter.route('/events/updateComment').post(eventCtrl.commentsUpdate);
        apiRouter.route('/events/delComment').post(eventCtrl.commentsRemove);

        //Picture
        apiRouter.route('/events/addPicture').post(eventCtrl.pictureAdd);
        apiRouter.route('/events/delPicture').post(eventCtrl.pictureRemove);
        apiRouter.route('/events/getAllPicture').get(eventCtrl.getAllPicture);
        
        //Like
        apiRouter.route('/events/getLike').get(eventCtrl.getLike);
        apiRouter.route('/events/getAllLike').get(eventCtrl.getAllLike);
        apiRouter.route('/events/like').post(eventCtrl.like);
        apiRouter.route('/events/unlike').post(eventCtrl.unlike);
    

    //Token
    apiRouter.route('/token').get(tokenCtrl.token);

    return apiRouter;
})();