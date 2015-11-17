import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from '../components/App';
import pages from '../pages';

/*
	IMPORTANT.
	Order is critical here. "/:username" must be placed last in the routing table.
	Oterwise it will catch routes like "/contact " or "/signin".
*/
export default (
  <Route path="/" component={App}>
  	<IndexRoute component={pages.Root}/>
    <Route path="/settings" component={pages.EditProfile}/>
  	<Route path="/signin" component={pages.SignIn}/>
    <Route path="/write" component={pages.Write}/>

    /* Place /:username last so it doesn't catch other routes. */
  	<Route path="/:username" component={pages.ProfilePage}/>  	
  </Route>
);
