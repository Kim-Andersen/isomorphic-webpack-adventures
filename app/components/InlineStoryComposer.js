import React from 'react';
import { connect } from 'react-redux'
import { me as meActions } from '../shared/actions'
import _ from 'lodash'
import TagEditor from './TagEditor'

let InlineStoryComposer = React.createClass({

  getInitialState: function(){
    return {
      tags: []
    }
  },

  render() {
    return (
      <div className="inline-story-composer">
        <form onSubmit={this.onSubmit}>
          <textarea ref="text" rows="5" className="form-control" placeholder="What are you working on?"></textarea>

          <TagEditor onChange={this.onTagsChanged} />
          
          {this.props.showTweetOption ? 
            <div className="tweet-story">
              <label htmlFor="tweet">Tweet</label>
              <input type="checkbox" name="tweet" ref="tweet" />
            </div> 
          : null}
          <button type="submit" className="btn btn-default">Publish</button>
        </form>
      </div>
    );
  },

  onTagsChanged(tags){
    this.setState({
      tags: tags
    })    
  },

  onSubmit(e){
    e.preventDefault()
    let text = _.trim(this.refs.text.value)
    let tags = this.state.tags
    let tweet = this.refs.tweet && this.refs.tweet.checked

    let story = {
      text: text,
      hashtags: tags,
      tweet: tweet
    }
    
    if(text.length === 0){
      return
    } else {
      this.props.dispatch(meActions.saveStory(story))
        .done((story) => {
          this.reset();
          _.isFunction(this.props.onStorySaved) && this.props.onStorySaved(story);
        }.bind(this))
    }
  },

  reset(){
    this.refs.text.value = '';
    this.setState({
      tags: []
    })    
  }
});

export default connect((state) => state.me)(InlineStoryComposer)