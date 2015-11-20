import React from 'react';
import { connect } from 'react-redux'
import { me as meActions } from '../shared/actions'
import _ from 'lodash'
import moment from 'moment'
import ApiClient from '../ApiClient'
import TagEditor from './TagEditor'
import ProjectSelector from './ProjectSelector'

let InlineStoryComposer = React.createClass({

  getInitialState: function(){
    return {
      tags: [],
      autoSavedAt: undefined,
      projectId: undefined
    }
  },

  componentWillMount: function(){
    this.autoSaveStory = _.throttle(this.autoSaveStory, 3000, {leading: false});
  },

  componentDidMount(){
    this.fetchProjects()
  },

  render() {
    let projects = this.state.projects// [{title: 'Hola', _id: '564dd9b1af75f35e37ab9768'}]

    return (
      <div className="inline-story-composer">
        <form onSubmit={this.onSubmit}>
          <textarea 
            ref="text" 
            rows="3" 
            className="form-control" 
            placeholder="What are you working on?"
            onChange={this.onTextChange}>
          </textarea>

          <TagEditor onChange={this.onTagsChanged} />

          {projects ? <ProjectSelector 
            projects={projects} 
            onChange={this.onProjectChange} /> : null}
          
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

  fetchProjects(){
    ApiClient.get('/me/projects?limit=200')
      .then((projects) => {
        this.setState({
          projects: projects
        })
      }.bind(this))
  },

  onProjectChange(projectId){
    
    this.setState({
      projectId: projectId === "" ? undefined : projectId
    })
    this.autoSaveStory();
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
      .then((story) => {
        
        this.setState({
          autoSavedAt: moment()
        })

      }.bind(this))
      .catch((reason) => {
        console.log('Failed to auto-save:', reason)
      })
  },

  onSubmit(e){
    e.preventDefault()

    this.autoSaveStory.cancel();

    this.story = this.story || {}
    this.story.isPublished = true

    this.saveStory()
      .then((story) => {
        alert('Published OK')
        this.reset();
        if(_.isFunction(this.props.onStorySaved)){
          this.props.onStorySaved(this.story);
        }
      }.bind(this))
  },

  saveStory(){
    return new Promise((resolve, reject) => {

      let story = Object.assign({}, _.pick(this.story, ['id', 'text', 'hashtags', 'isPublished']), {
        text: _.trim(this.refs.text.value),
        hashtags: this.state.tags,
        project: this.state.projectId
        //tweet: this.refs.tweet && this.refs.tweet.checked
      })

      if(!this.isValid(story)){
        reject('invalid')
      } else {
        console.log('story', story);

        this.props.dispatch(meActions.saveStory(story))
          .then((story) => {
            this.story = story
            resolve(story)
          }.bind(this))
      }
    }.bind(this))
  },

  isValid(story){
    return story.text.length > 0;
  },

  reset(){
    this.refs.text.value = '';
    this.setState({
      tags: [],
      autoSavedAt: undefined,
      projectId: undefined
    })
    this.story = undefined
  }
});

export default connect((state) => state.me)(InlineStoryComposer)