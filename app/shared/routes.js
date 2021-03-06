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
    <Route path="/me/stories" component={pages.MyStories}/>
    <Route path="/me/projects" component={pages.MyProjects}/>
    <Route path="/me/settings" component={pages.Settings}/>
  	<Route path="/signin" component={pages.SignIn}/>

    /* Place /:username last so it doesn't catch other routes. */
  	<Route path="/:username" component={pages.ProfilePage} />
    <Route path="/:username/stories/:storyId" component={pages.OneStory} />
  </Route>
);
