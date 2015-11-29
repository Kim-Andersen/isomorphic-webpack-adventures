import React, { PropTypes } from 'react'
import Helmet from "react-helmet";
import moment from 'moment'
import StoryList from './StoryList'
import StoryTimeline from './StoryTimeline'
import ActivityTimeline from './ActivityTimeline'

let Profile = React.createClass({
	
	render(){
		var user = this.props.user,
				latestStories = user.latestStories || [];

		user.profile = user.profile || {};
		user.contact = user.contact || {};

		let activities = [
			{
				type: 'experimenting',
				text: 'Playing with isomorphic web applications using React and Express',
				project: {
					title: 'Hola'
				},
				story: {
					body: 'Thanksgiving doesnt really rhyme with Star Wars Episode VII, but given that Disney wants to break the record of trailers before a theatrical release, heres a brand new trailer full of exclusive footage. You should stop reading right here if you dont want to get spoilers.'
				}
			},
			{
				type: 'learning',
				text: 'Taking on MongoDB (mongoose+express) by building a RESTful service API. Pure joy.'
			},
			{
				type: 'inspired',
				text: 'Trying a new approach with "verb-based" status updates. Could prove to be a UX challenge, but worth a shot.',
				story: {
					body: 'You should stop reading right here if you dont want to get spoilers.'
				}
			},
			{
				type: 'building',
				text: 'Trying a new approach with "verb-based" status updates. Could prove to be a UX challenge, but worth a shot.',
				story: {
					body: 'You should stop reading right here if you dont want to get spoilers.'
				}
			}
		]

		return (
			<div className="profile">
				<Helmet title={user.username}/>

				<header>
					<div className="container">
						<h1 className="h3">{user.profile.name || user.username}</h1>
						<p>{user.profile.location}</p>
					</div>					
				</header>

				<div className="container">
					<div className="row">
					
				  	<div className="col-xs-12 col-sm-4 col-md-3">
				  		<p dangerouslySetInnerHTML={{__html: user.profile.bio.substring(0,200)+'...'.replace(/(?:\r\n|\r|\n)/g, '<br />')}} />
				  		
				  		<p>{user.contact.email}</p>
				  		<p>{user.contact.phone}</p>
				  	</div>

				  	<div className="col-xs-12 col-sm-8 col-md-9">

				  		<ActivityTimeline activities={activities} />

				  		<StoryTimeline 
				  			mode="kickstarter"
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