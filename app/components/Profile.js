import React, { PropTypes } from 'react'

let Profile = React.createClass({

	componentWillMount(){
		console.log('componentWillMount');
	},

	render(){
		return (
			<div className="profile">
				<h5 className="subheader">PROFILE</h5>
				<h1>{this.props.user.username}</h1>
			</div>
		)
	}

})

Profile.propTypes = {
  user: PropTypes.object.isRequired
}

export default Profile