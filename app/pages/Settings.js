import React from 'react';
import Helmet from "react-helmet";
import { connect } from 'react-redux'
import _ from "lodash";
import { toggleSignupDialog } from '../shared/actions/'
import ApiClient from '../ApiClient'

let Settings = React.createClass({
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
            <input type="text" name="location" ref="location" defaultValue={profile.location} placeholder="Your location" className="form-control" />
          </div>
          <div className="form-group text-left">
            <label htmlFor="name" className="control-label">Bio</label>
            <textarea name="bio" ref="bio" defaultValue={profile.bio} placeholder="Your bio" className="form-control" rows="3"></textarea>
          </div>

          <button type="submit" className="btn btn-default">Save</button>
        </form>
        
      </div>
    )
  },

  onSubmit(e){
    e.preventDefault()

    let payload = {
      profile: {
        name: _.trim(this.refs.name.value),
        location: _.trim(this.refs.location.value),
        bio: _.trim(this.refs.bio.value)
      }
    }

    console.log('payload', payload);

    ApiClient.patch('/me', payload)
      .done(() => {
        console.log('user updated successfully');
      }.bind(this))
      .fail((res) => {
        switch(res.status){
          case 400:
            console.log('invalid', res.responseJSON);
            break;
          default:
            console.log('error', res.responseJSON);
            break;
        }
      }.bind(this))
  }
});

export default connect(state => state.session)(Settings);