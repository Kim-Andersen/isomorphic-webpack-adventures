import '../scss/main.scss';

import React from 'react';
import ReactDom from 'react-dom';
import Router from 'react-router';
import {createHistory} from 'history';
import routes from './routes';
import ApiClient from './ApiClient';

// Init ApiClient.
ApiClient.init({baseUrl: 'http://localhost:3000'});

// Routing.
let history = createHistory();
ReactDom.render(<Router history={history}>{routes}</Router>, document.getElementById('app'));
