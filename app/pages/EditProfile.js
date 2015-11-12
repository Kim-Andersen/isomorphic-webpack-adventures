import React from 'react';
import Helmet from "react-helmet";
import { connect } from 'react-redux'
import { toggleSignupDialog } from '../shared/actions/'

let EditProfile = React.createClass({
  render() {
    let user = this.props.user
    let profile = user.profile || {}

  	return (
      <div>
        <Helmet title="Edit profile"/>

        <form onSubmit={this.onSubmit} autoComplete="off">
          <div className="form-group text-left">
            <label htmlFor="name" className="control-label">Name</label>
            <input type="text" name="name" ref="name" defaultValue={profile.name} placeholder="Your name" className="form-control" />
          </div>
          <div className="form-group text-left">
            <label htmlFor="name" className="control-label">Location</label>
            <input type="text" name="locataion" ref="locataion" defaultValue={profile.location} placeholder="Your location" className="form-control" />
          </div>
          <div className="form-group text-left">
            <label htmlFor="name" className="control-label">Bio</label>
            <textarea name="bio" ref="bio" defaultValue={profile.bio} placeholder="Your bio" className="form-control" rows="3"></textarea>
          </div>
        </form>
        
      </div>
    )
  },

  onSubmit(e){
    e.preventDefault()


  }
});

export default connect(state => state.session)(EditProfile);