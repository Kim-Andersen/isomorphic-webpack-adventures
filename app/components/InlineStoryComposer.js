import React from 'react';
import { connect } from 'react-redux'
import { me as meActions } from '../shared/actions'
import _ from 'lodash'
import findHashtags from 'find-hashtags';

let StoryHashtags = React.createClass({
  render(){
    return (
      <div>
        {this.props.hashtags.map(function(hashtag, index){
          return (<span key={index}>#{hashtag}&nbsp;</span>)
        })}
      </div>
    )
  }
})

let InlineStoryComposer = React.createClass({

  getInitialState: function(){
    return {
      hashtags: []
    }
  },

  componentWillMount: function(){
    this.detectHashtags = _.debounce(this.detectHashtags, 250, {leading: false});
  },

  render() {
    console.log('render')
    return (
      <div className="inline-story-composer">
        <h2>InlineStoryComposer</h2>
        <form onSubmit={this.onSubmit}>
          <textarea ref="text" rows="5" onChange={this.onTextChange}></textarea>

          <StoryHashtags hashtags={this.state.hashtags} />
          
          {this.props.showTweetOption ? 
            <div className="tweet-story">
              <label htmlFor="tweet">Tweet</label>
              <input type="checkbox" name="tweet" ref="tweet" />
            </div> 
          : null}
          <button type="submit" className="btn btn-default">Post story</button>
        </form>
      </div>
    );
  },

  onTextChange(e){
    e.preventDefault;
    this.detectHashtags();
  },

  detectHashtags(){
    let text = this.refs.text.value
    let hashtags = [];
    if(text.length > 2){
      hashtags = findHashtags(text);
      console.log('hashtags', hashtags);
      this.setState({
        hashtags: hashtags
      });      
    }
    
    return hashtags;
  },

  onSubmit(e){
    e.preventDefault()
    let text = _.trim(this.refs.text.value)
    let hashtags = this.state.hashtags
    let tweet = this.refs.tweet && this.refs.tweet.checked

    let story = {
      text: text,
      hashtags: hashtags,
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
  }
});

export default connect((state) => state.me)(InlineStoryComposer)