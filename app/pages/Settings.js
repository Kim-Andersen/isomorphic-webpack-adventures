import React from 'react';
import Helmet from "react-helmet";
import { connect } from 'react-redux'
import _ from "lodash";
import ApiClient from '../ApiClient'

let Settings = React.createClass({
  render() {
    let user = this.props.user
    let profile = user.profile || {}
    let contact = user.contact || {}

    if(!contact.email){
      contact.email = user.email
    }

  	return (
      <div>
        <Helmet title="Settings"/>

        <form onSubmit={this.onSubmit} autoComplete="off">

          <h3>Profile</h3>

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

          <h3>Contact</h3>

          <div className="form-group text-left">
            <label htmlFor="name" className="control-label">E-mail</label>
            <input type="email" name="email" ref="email" defaultValue={contact.email} placeholder="Your contact e-mail address" className="form-control" />
          </div>
          <div className="form-group text-left">
            <label htmlFor="name" className="control-label">Phone</label>
            <input type="text" name="phone" ref="phone" defaultValue={contact.phone} placeholder="Your phone no." className="form-control" />
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
      },
      contact: {
        phone: _.trim(this.refs.phone.value)
      }
    }

    let email = _.trim(this.refs.email.value)
    if(email.length > 0){
      payload['contact']['email'] = email
    }

    console.log('payload', payload);

    ApiClient.patch('/me', payload)
      .then(() => {
        console.log('user updated successfully');
      }.bind(this))
      .catch((res) => {
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