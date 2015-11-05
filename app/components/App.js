import React from 'react';
import {Link} from 'react-router';
import Helmet from "react-helmet";

let LandingPage = React.createClass({
  render() {
    return (
      <div>
        <h1>Landing page</h1>
        <ul>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/signin">Sign in</Link></li>
        </ul>
        {this.props.children}
      </div>  
    );
  }
});

let HomePage = React.createClass({
  render() {
    return (
      <div>
        <h1>Home page</h1>        
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

  getInitialState: function(){
    return {
      isAuthenticated: true
    };
  },

  render() {
    return (
      <div>
        <Helmet title="[Name]"/>
        {this.state.isAuthenticated ? <HomePage /> : <LandingPage />}
        {this.props.children}
      </div>
    )
  }
});

export default App;
