import React, { PropTypes } from 'react'
import Helmet from "react-helmet";

let Profile = React.createClass({

	render(){
		var latestStories = this.props.user.latestStories || [];
		console.log('latestStories', latestStories);

		return (
			<div className="profile">
				<Helmet title={this.props.user.username}/>
				<h5 className="subheader">PROFILE</h5>
				<h1>{this.props.user.username}</h1>

				<ul>
					{latestStories.map((story, index) =>
          <li key={index}>
          	<div>
          		{story.text}
          		<div>{story.hashtags.map(function(hashtag, index){
          			return (<a href="#" key={index}>#{hashtag}&nbsp;</a>)
          		})}</div>
          	</div>
          </li>
        )}
				</ul>
			</div>
		)
	}

})

Profile.propTypes = {
  user: PropTypes.object.isRequired
}

export default Profile