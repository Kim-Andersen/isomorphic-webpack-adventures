import '../scss/main.scss';

import React from 'react';
import ReactDom from 'react-dom';
import { Router, Route } from 'react-router';
import { createHistory } from 'history';
import routes from './routes';
import ApiClient from './ApiClient';

import App from './components/App';

import { createStore } from 'redux'
import { default as reducer } from './shared/reducers/'
import { Provider } from 'react-redux'

// Init ApiClient.
ApiClient.init({baseUrl: 'http://localhost:3000'});

// Grab the state from a global injected into server-generated HTML.
const initialState = window.__INITIAL_STATE__;

// Create Redux store with initial state
let store = createStore(reducer, initialState);
console.log('store', store);

let unsubscribe = store.subscribe(() =>
  console.log(store.getState())
)

// Routing.
let history = createHistory();

ReactDom.render(
	<Provider store={store}>
		<Router history={history}>{routes}</Router>
	</Provider>,
	document.getElementById('app')
);

/*ReactDom.render(
	<Router history={history}>{routes}</Router>, document.getElementById('app'));*/
