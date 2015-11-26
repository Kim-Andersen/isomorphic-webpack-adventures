import React from 'react';
import { connect } from 'react-redux'
import { me as meActions } from '../shared/actions'
import _ from 'lodash'
import moment from 'moment'
import ApiClient from '../ApiClient'
import TagEditor from './TagEditor'
import ProjectSelector from './ProjectSelector'

let InlineStoryComposer = React.createClass({

  ABSTRACT_MAX_LENGTH: 140,
  BODY_MAX_LENGTH: 2000,

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
          
          <div className="form-group">
            <textarea 
              ref="abstract" 
              rows="3" 
              className="form-control" 
              placeholder="What are you working on? (in 140 characters)"
              onChange={this.onAbstractChange}>
            </textarea>
          </div>

          <div className="form-group">
            <textarea 
              ref="body" 
              rows="6"
              className="form-control" 
              placeholder="If you need to write more..."
              onChange={this.onBodyChange}>
            </textarea>
          </div>

          <div className="form-group">
            <TagEditor ref="tagEditor" onChange={this.onTagsChanged} />
          </div>
          
          {projects ? 
            <div className="form-group">
              <ProjectSelector 
                projects={projects} 
                onChange={this.onProjectChange} />
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

  onAbstractChange(e){
    let text = _.trim(this.refs.abstract.value)

    if(text.length > this.ABSTRACT_MAX_LENGTH){
      text = this.refs.abstract.value = text.substring(0, this.ABSTRACT_MAX_LENGTH)
    }

    if(text.length > 0){
      this.autoSaveStory();
    }
  },

  onBodyChange(e){
    let text = _.trim(this.refs.body.value)

    if(text.length > this.BODY_MAX_LENGTH){
      text = this.refs.body.value = text.substring(0, this.BODY_MAX_LENGTH)
    }

    this.autoSaveStory();
  },

  onTagsChanged(tags){
    this.setState({
      tags: tags
    })
    this.autoSaveStory();
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

      let story = Object.assign({}, _.pick(this.story, ['id', 'abstract', 'body', 'tags', 'isPublished']), {
        abstract: _.trim(this.refs.abstract.value),
        body: _.trim(this.refs.body.value),
        tags: this.state.tags,
        project: this.state.projectId
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
    return story.abstract.length > 0;
  },

  reset(){
    this.refs.abstract.value = '';
    this.refs.body.value = '';
    this.refs.tagEditor.empty()
    this.setState({
      tags: [],
      autoSavedAt: undefined,
      projectId: undefined
    })
    this.story = undefined
  }
});

export default connect((state) => state.me)(InlineStoryComposer)