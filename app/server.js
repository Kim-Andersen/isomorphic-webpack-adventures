require('es6-promise').polyfill();
import path from 'path';
import express from 'express';
import React from 'react';
import {renderToString} from 'react-dom/server';
import createLocation from 'history/lib/createLocation';
import Helmet from 'react-helmet';
import {RoutingContext, match} from 'react-router';
import routes from './routes';
import morgan from 'morgan';
import { createStore, applyMiddleware } from 'redux'
import { default as reducer } from './shared/reducers/'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import { initAuthentication } from './server/authentication'

const env = process.env;
const assetsPath = `${env.npm_package_config_appWebpackBaseUrl}/${env.npm_package_version}`;
const publicPath = path.resolve('../public');

let app = express();
app.set('trust proxy', 'loopback');
app.set('x-powered-by', false);
app.use(express.static(publicPath));
app.use(morgan('dev')); // log every request to the console

initAuthentication();

// Prepare Redux store creator.
const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware
)(createStore)

app.use((req, res, next) => {
  let initialState = {};  
  
  if(req.isAuthenticated()){
    initialState = Object.assign({}, initialState, {
      user: req.user,
      apiToken: req.user.generateApiToken(app.get('apiTokenSecret'))
    });
  }
  // Create Redux store with initial state (to inject into the html)
  let store = createStoreWithMiddleware(reducer, initialState)

  let location = createLocation(req.originalUrl);
  match({routes, location}, (error, redirectLocation, renderProps) => {
    if (redirectLocation) return res.redirect(redirectLocation.pathname);
    if (error) return next(error.message);
    if (renderProps == null) return next(error);

    //console.log('req.isAuthenticated()', req.isAuthenticated(), renderProps);

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
          `<meta charset="utf-8"/>`,
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

});

export default app;