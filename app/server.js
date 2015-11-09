require('es6-promise').polyfill();
import path from 'path';
import express from 'express';
import React from 'react';
import {renderToString} from 'react-dom/server';
import createLocation from 'history/lib/createLocation';
import Helmet from 'react-helmet';
import {RoutingContext, match} from 'react-router';
import routes from './shared/routes';
import { createStore, applyMiddleware } from 'redux'
import { default as reducer } from './shared/reducers/'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import authentication from './server/authentication'
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import compression from 'compression';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import { User, Story } from '../models';
import _ from 'lodash';
import ErrorCodes from './shared/ErrorCodes';
import { COOKIE_PARSER_SECRET } from '../authConfig'
import { signup, login, me } from './server/routes/'
import twitterApi from './server/twitterAPI'

const env = process.env;
const mongoConnection = env.npm_package_config_appMongoConnection;
const assetsPath = `${env.npm_package_config_appWebpackBaseUrl}/${env.npm_package_version}`;
const publicPath = path.resolve('../public');

mongoose.connect(mongoConnection);

//app.set('trust proxy', 'loopback');
//app.set('x-powered-by', false);


let router = express.Router({mergeParams: true});
router.use(express.static(publicPath));
router.use(morgan('dev')); // log every request to the console
router.use(compression());
router.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
router.use(bodyParser.json());                                     // parse application/json
router.use(methodOverride());
router.use(cookieParser(COOKIE_PARSER_SECRET)); // secret value can be anything.

let mongoStore = MongoStore(session);
router.use(session({
  resave: true,
  saveUninitialized: true,
  secret: '5r(e_$V18_b3.dy', // secret can be anything.
  //maxAge: new Date(Date.now() + 3600000),
  store: new mongoStore({
    mongooseConnection: mongoose.connection
  })
}));

router.use(passport.initialize());
router.use(passport.session());

router.use(signup)
router.use(login)
router.use(authentication());
router.use('/me', me)

// Init Twitter API
//twitterApi.init({});
//console.log('twitterApi', twitterApi.statuses);

var sendJsonErrorCode = function(res, errCode, data){
  var json = {
    message: errCode.message, 
    error_code: errCode.code
  };
  _.extend(json, {}, data);
  return res.status(errCode.status || 500).json(json);
};

// Prepare Redux store creator.
const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware
)(createStore)

router.get('/signout', function(req, res){
  req.logout();
  res.redirect('/');
});

function renderIsomorphicPage(req, res, next, initialState = {}){

  if(req.isAuthenticated()){
    initialState['session'] = {
      apiToken: req.user.generateApiToken(),
      user: req.user
    };
  }
  
  // Create Redux store with initial state (to inject into the html)
  let store = createStoreWithMiddleware(reducer, initialState)

  let location = createLocation(req.originalUrl);
  match({routes, location}, (error, redirectLocation, renderProps) => {
    if (redirectLocation) return res.redirect(redirectLocation.pathname);
    if (error) return next(error.message);
    if (renderProps == null) return next(error);

    let markup = renderToString(
        <Provider store={store}>
          <RoutingContext {...renderProps}/>
        </Provider>
    );
    let helmet = Helmet.rewind();
    let html = [
      `<!DOCTYPE html>`,
      `<html>`,
        `<head>`,
          `<title>${helmet.title}</title>`,
          helmet.meta,
          helmet.link,
          `<meta charset="utf-8">`,
          `<meta http-equiv="X-UA-Compatible" content="IE=edge">`,
          `<meta name="viewport" content="width=device-width, initial-scale=1">`,
          `<link rel="stylesheet" href="${assetsPath}/app.css"></link>`,
        `</head>`,
        `<body>`,
          `<div class="container-fluid">`,
            `<div id="app">${markup}</div>`,
           `</div>`,
        `</body>`,
        `<script>`,
          `window.__STATE__ = ${JSON.stringify(initialState)}`,
        `</script>`,
        `<script type="text/javascript" src="${assetsPath}/app.js"></script>`,
      `</html>`
    ].join('');
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  });
}

// Public profile.
var publicProfileHandler = (req, res, next) => {
  console.log('publicProfileHandler');
  if(_.isString(req.params.username)){
    User
      .findOne({username_lower: req.params.username.toLowerCase()})
      .populate('latestStories', 'text createdAt')
      .exec(function(err, user){
        if(err){
          return next(err)
        } else if(!user) {
          console.log('user not found');
          next();
        } else {        
          let initialState = {
            profile: {
              user: user
            }
          };
          /*if(!req.user || req.user.id !== user.id){
            initialState['profile'] = {
              user: user
            };  
          }*/
          renderIsomorphicPage(req, res, next, initialState);
        }
      }
    )  
  } else {
    next();
  }
}

var isomorphicHandler = (req, res, next) => {
  console.log('isomorphicHandler');
  let initialState = {};
  renderIsomorphicPage(req, res, next, initialState);
}

router.use(['/:username', '/*'], publicProfileHandler, isomorphicHandler)

// Dynamic isomorphic routing.
/*router.use('/*', (req, res, next) => {
  let initialState = {};

  renderIsomorphicPage(req, res, next, initialState);
});*/

router.use(function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    console.log(err.stack);
    res.status(500).send({ error: 'Something blew up!' });
  } else {
    next(err);
  }
});

router.use(function errorHandler(err, req, res, next) {
  console.log(err.stack);
  res.status(500).send({ message: 'Server error', error: err });
});

export default router;