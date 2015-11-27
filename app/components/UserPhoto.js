import React, { PropTypes } from 'react'
import Classnames from 'classnames'

let UserPhoto = React.createClass({
	
	propTypes: {
  	user: PropTypes.object.isRequired,
  	size: PropTypes.oneOf(['small', 'medium']).isRequired,
  	type: PropTypes.oneOf(['rounded', 'circle', 'thumbnail']).isRequired,
	},

	render(){
		let user = this.props.user
		let alt = user.name || user.username
		let photoUri = user.photo
		if(!photoUri){
			if(user.twitter && user.twitter.photo){
				photoUri = user.twitter.photo
			}
		}

		if(!photoUri){
			photoUri = 'http://pic2.pbsrc.com/common/profile_female_large.jpg'
		}

		return(
			<img 
				src={photoUri} alt={alt} 
				className={Classnames('user-photo', this.props.size, 'img-'+this.props.type)} 
				/>
		)
	}
})

export default UserPhoto