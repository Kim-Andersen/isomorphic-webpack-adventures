import React from 'react';
import { connect } from 'react-redux'
import { me as meActions } from '../shared/actions'
import _ from 'lodash'
import moment from 'moment'
import TagEditor from './TagEditor'

let InlineStoryComposer = React.createClass({

  getInitialState: function(){
    return {
      tags: [],
      autoSavedAt: undefined
    }
  },

  componentDidMount: function(){
    this.autoSaveStory = _.throttle(this.autoSaveStory, 5000, {leading: false});
  },

  render() {
    return (
      <div className="inline-story-composer">
        <form onSubmit={this.onSubmit}>
          <textarea 
            ref="text" 
            rows="5" 
            className="form-control" 
            placeholder="What are you working on?"
            onChange={this.onTextChange}>
          </textarea>

          <TagEditor onChange={this.onTagsChanged} />
          
          {this.props.showTweetOption ? 
            <div className="tweet-story">
              <label htmlFor="tweet">Tweet</label>
              <input type="checkbox" name="tweet" ref="tweet" />
            </div> 
          : null}
          <button type="submit" className="btn btn-default">Publish</button>
          {this.state.autoSavedAt ? ' Auto-saved '+ moment(this.state.autoSavedAt).fromNow() : null}
        </form>
      </div>
    );
  },

  onTagsChanged(tags){
    this.setState({
      tags: tags
    })
    this.autoSaveStory();
  },

  onTextChange(e){
    if(this.refs.text.value.length > 0){
      this.autoSaveStory();
    }    
  },

  autoSaveStory(){
    this.saveStory()
      .done((res) => {
        debugger
        if(res.story){
          this.story = res.story
        }

        this.setState({
          autoSavedAt: moment()
        })

      }.bind(this))    
  },

  onSubmit(e){
    e.preventDefault()

    this.autoSaveStory.cancel();

    this.story = this.story || {}
    this.story.isPublished = true

    if(this.refs.text.value.length === 0){
      console.log('You need to write something.');
      return
    } else {
      this.saveStory()
        .done((res) => {
          debugger;
          this.reset();
          if(_.isFunction(this.props.onStorySaved)){
            this.props.onStorySaved(this.story);
          }
        }.bind(this))
    }
  },

  saveStory(){
    let story = Object.assign({}, _.pick(this.story, ['id', 'text', 'hashtags', 'isPublished']), {
      text: _.trim(this.refs.text.value),
      hashtags: this.state.tags,
      tweet: this.refs.tweet && this.refs.tweet.checked
    })

    this.story = story
    
    return this.props.dispatch(meActions.saveStory(story))
  },

  reset(){
    this.refs.text.value = '';
    this.setState({
      tags: [],
      autoSavedAt: undefined
    })
    this.story = undefined
  }
});

export default connect((state) => state.me)(InlineStoryComposer)