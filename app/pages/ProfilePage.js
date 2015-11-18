import React from 'react';
import Helmet from "react-helmet";
import { connect } from 'react-redux'
import { toggleSignupDialog } from '../shared/actions/'
import Profile from '../components/Profile'
import ApiClient from '../ApiClient'

let ProfilePage = React.createClass({

  getInitialState(){
    return {
      user: null
    }
  },

  componentWillMount(){
    if(this.props.profile){
      this.setState({
        user: this.props.profile.user
      })
    }
  },

  componentDidMount(){
    // Only fetch the profile if it's different from what the server rendered (via props/initial state)).
    if(!this.props.profile || this.props.profile.user.username !== this.props.params.username){
      
      this.setState({
        isLoading: true
      })

      this.fetchProfile(this.props.params.username)
    }
  },

  componentWillUpdate(nextProps){
    // If param username changed we fetch the profile and update the UI.
    let currentUsername = this.props.params.username
    let nextUsername = nextProps.params.username
    if(currentUsername !== nextUsername){
      this.fetchProfile(nextUsername)
    }
  },

  render() {
    //console.log('ProfilePage.render')
    let user = this.state.user

  	if(user) {
  		return (
	    	<Profile user={user}>
	    	</Profile>
    	)
  	} else if(this.state.isLoading) {
      return (
        <div>
        </div>
      )
    } else {
  		return (
        <div>
          <Helmet title="User not found"/>
  			  <h1>User not found</h1>
        </div>
  		)
  	}  	
  },

  fetchProfile(username){
    ApiClient.get('/profile/'+username)
      .then((user) => {

        this.setState({
          user: user,
          isLoading: false
        })

      }.bind(this))
      .catch((res) => {
        if(res.status === 404){
          console.log('User not found');
        } else {
          alert('Failed to load user profile.');
        }

        this.setState({
          user: null,
          isLoading: false
        })

      }.bind(this))
  }

});

export default connect(state => state)(ProfilePage);