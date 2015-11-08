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
    let stories = this.props.stories && this.props.stories.items || []

    return (
      <div>
        <h1>Home page</h1>

        <InlineStoryComposer onStorySaved={this.fetchMyStories} />
        
        { this.props.stories.error ? 'Your stories are not available at the moment.' : null }

        {stories.map((story, index) =>
          <div key={index}>
            {story.text}
          </div>
        )}

        <ul>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
        {this.props.children}
      </div>
    );
  }
});

export default connect((state) => state.me)(HomePage)