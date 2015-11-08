import React from 'react';
import {Route} from 'react-router';
import App from '../components/App';
import pages from '../pages';

export default (
  <Route path="/" component={App}>
  	<Route path="/signin" component={pages.SignIn}/>
    <Route path="/about" component={pages.About}/>
    <Route path="/contact" component={pages.Contact}/>
  </Route>
);
