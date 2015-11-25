import React, { PropTypes } from 'react'
import Helmet from "react-helmet";
import moment from 'moment'
import StoryList from './StoryList'
import StoryTimeline from './StoryTimeline'

let Profile = React.createClass({
	
	render(){
		var user = this.props.user,
				latestStories = user.latestStories || [];

		user.profile = user.profile || {};
		user.contact = user.contact || {};

		return (
			<div className="profile">
				<Helmet title={user.username}/>

				<div className="row">
				
			  	<div className="col-xs-12 col-sm-3 col-md-2">
			  		<h1 className="h3">{user.profile.name || user.username}</h1>
			  		<p>{user.profile.location}</p>
			  		<p>{user.profile.bio}</p>

			  		<p>{user.contact.email}</p>
			  		<p>{user.contact.phone}</p>
			  	</div>

			  	<div className="col-xs-12 col-sm-9 col-md-10">
			  		<StoryTimeline stories={latestStories} storyBaseUri={`/${user.username}/stories/`} />
			  	</div>

				</div>

			</div>
		)
	}

})

Profile.propTypes = {
  user: PropTypes.object.isRequired
}

export default Profile