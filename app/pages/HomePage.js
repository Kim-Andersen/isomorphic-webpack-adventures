import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux'
import { me as meActions } from '../shared/actions'
import InlineStoryComposer from '../components/InlineStoryComposer'

let HomePage = React.createClass({

  componentDidMount(){
    this.fetchMyStories();
  },

  fetchMyStories(){
    this.props.dispatch(meActions.fetchMyStories())
  },

  render() {
    let stories = this.props.me.stories && this.props.me.stories.items || []

    let showConnectTwitterButton = !this.props.user.twitter;
    console.log('this.props.user', this.props.user);

    return (
      <div>
        <h1>Home page</h1>

        <hr />
        <InlineStoryComposer onStorySaved={this.fetchMyStories} />
        <hr />
        
        { this.props.me.stories && this.props.me.stories.error ? 'Your stories are not available at the moment.' : null }

        {stories.map((story, index) =>
          <div key={index}>
            {story.text}
          </div>
        )}

        <hr />

        {this.props.user.twitter && this.props.user.twitter.token ? 
          <a href="/unlink/twitter" className="btn btn-default">Disconnect Twitter</a>
        : <a href="/connect/twitter" className="btn btn-default">Connect Twitter</a>}

        <hr />

        <ul>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
        {this.props.children}
      </div>
    );
  }
});

export default connect((state) => state)(HomePage)