import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Helmet from "react-helmet";
import { connect } from 'react-redux'
import { signIn } from '../shared/actions'
import Header from './Header'
import SignInOverlay from './SignInOverlay'
import { HomePage } from '../pages/'

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
          onSignInButtonClick={this.onSignInButtonClick} />
        
        {this.props.signIn.show ? <SignInOverlay onCloseClick={this.onSignInOverlayCloseClick} /> : null}
        {this.props.children}
      </div>
    )
  }
});

function select(state){
  return state;
}

export default connect(select)(App);
//export default App;
