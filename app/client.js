require('es6-promise').polyfill();
import '../scss/main.scss';
import React from 'react';
import ReactDom from 'react-dom';
import { Router, Route } from 'react-router';
import { createHistory } from 'history';
import routes from './routes';
import ApiClient from './ApiClient';
import App from './components/App';
import { createStore, applyMiddleware } from 'redux'
import { default as reducer } from './shared/reducers/'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'

// Init ApiClient.
ApiClient.init({baseUrl: 'http://localhost:3000'});

// Grab the state from a global injected into server-generated HTML.
const initialState = window.__STATE__;

// init redux logger
const loggerMiddleware = createLogger()

// Redux middelware store creator
const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware, // lets us dispatch() functions
  loggerMiddleware // neat middleware that logs actions
)(createStore)

// Create Redux store
const store = createStoreWithMiddleware(reducer, initialState)

// Routing.
let history = createHistory();
ReactDom.render(
	<Provider store={store}>
		<Router history={history}>{routes}</Router>
	</Provider>,
	document.getElementById('app')
);