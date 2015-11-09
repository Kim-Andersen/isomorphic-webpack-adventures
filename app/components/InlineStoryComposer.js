import React from 'react';
import { connect } from 'react-redux'
import { me as meActions } from '../shared/actions'
import _ from 'lodash'

let InlineStoryComposer = React.createClass({

  render() {
    return (
      <div className="inline-story-composer">
        <h2>InlineStoryComposer</h2>
        <form onSubmit={this.onSubmit}>
          <textarea ref="text"></textarea>
          
          {this.props.showTweetOption ? 
            <div class="tweet-story">
              <label htmlFor="tweet">Tweet</label>
              <input type="checkbox" name="tweet" ref="tweet" />
            </div> 
          : null}
          <button type="submit" className="btn btn-default">Post story</button>
        </form>
      </div>
    );
  },

  onSubmit(e){
    e.preventDefault()
    let text = _.trim(this.refs.text.value)
    let tweet = this.refs.tweet && this.refs.tweet.checked
    
    if(text.length === 0){
      return
    } else {
      this.props.dispatch(meActions.saveStory(text, tweet))
        .done((story) => {
          this.reset();
          this.props.onStorySaved(story);
        }.bind(this))
    }
  },

  reset(){
    this.refs.text.value = '';
  }
});

export default connect((state) => state.me)(InlineStoryComposer)