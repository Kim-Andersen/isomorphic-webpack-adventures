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

				<header>
					<div className="container">
						<h1 className="h3">{user.profile.name || user.username}</h1>
						<p>{user.profile.location}</p>
						<p style={{'maxWidth':'600px', 'margin': '0 auto'}}>{user.profile.bio}</p>
					</div>					
				</header>

				<div className="container">
					<div className="row">
					
				  	<div className="col-xs-12 col-sm-4 col-md-3">
				  		<p>{user.contact.email}</p>
				  		<p>{user.contact.phone}</p>
				  	</div>

				  	<div className="col-xs-12 col-sm-8 col-md-9">
				  		<StoryTimeline 
				  			mode="hybrid"
				  			stories={latestStories} 
				  			storyBaseUri={`/${user.username}/stories/`} />
				  	</div>

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