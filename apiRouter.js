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
const centerCtrl = require('./Route/centerController.js');

// Importation du centerController
const eventCtrl = require('./Route/eventController.js');

// Importation du centerController
const tokenCtrl = require('./Route/tokenController.js');

// Router

exports.router = (function() {

    var apiRouter = express.Router();

    // User
    apiRouter.route('/users/register/').post(usersCtrl.register);
    apiRouter.route('/users/login/').post(usersCtrl.login);
    apiRouter.route('users/events/old').get(usersCtrl.eventOld)

    //Center
    apiRouter.route('/centers').get(centerCtrl.centers);

    //Event
    apiRouter.route('/events/all').get(eventCtrl.all);
    apiRouter.route('/events/get').get(eventCtrl.get);

    //Token
    apiRouter.route('/token').get(tokenCtrl.token);

    return apiRouter;
})();