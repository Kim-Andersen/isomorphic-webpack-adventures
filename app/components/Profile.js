import React, { PropTypes } from 'react'

let Profile = React.createClass({

	render(){
		return (
			<div className="profile">
				<h5 className="subheader">PROFILE</h5>
				<h1>{this.props.user.username}</h1>

				<ul>
					{this.props.user.latestStories.map((story, index) =>
          <li key={index}>
            {story.text}
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