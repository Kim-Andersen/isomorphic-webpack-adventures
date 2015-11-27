import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Helmet from "react-helmet";
import { connect } from 'react-redux'
import { signIn, writeStoryOverlay } from '../shared/actions'
import Header from './Header'
import SignInOverlay from './SignInOverlay'
import { HomePage } from '../pages/'
import WriteStoryOverlay from './WriteStoryOverlay'

let LandingPage = React.createClass({
  render() {
    return (
      <div>
        <h1>Landing page</h1>
        <ul>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
        {this.props.children}
      </div>  
    );
  }
});

let App = React.createClass({

  onSignInButtonClick(e){
    e.preventDefault();
    this.props.dispatch(signIn.show());
  },

  onSignInOverlayCloseClick(e){
    e.preventDefault();
    this.props.dispatch(signIn.hide());
  },

  onHeaderWriteButtonClick(e){
    this.props.dispatch(writeStoryOverlay.show());
  },

  onWriteStoryOverlayCloseClick(e){
    e.preventDefault();
    this.props.dispatch(writeStoryOverlay.hide());
  },

  render() {
    let user = this.props.session && this.props.session.user

    return (
      <div>
        <Helmet
          title="welcome"
          titleTemplate="%s | [app name]"
        />

        <Header 
          user={user} 
          onSignInButtonClick={this.onSignInButtonClick}
          onWriteButtonClick={this.onHeaderWriteButtonClick} />
        
        <div className="container-fluid nopadding">
          {this.props.children}
        </div>

        {this.props.signIn.show ? <SignInOverlay onCloseClick={this.onSignInOverlayCloseClick} /> : null}
        {this.props.writeStoryOverlay.show ? <WriteStoryOverlay onCloseClick={this.onWriteStoryOverlayCloseClick} /> : null}
      </div>
    )
  }
});

function select(state){
  return state;
}

export default connect(select)(App);