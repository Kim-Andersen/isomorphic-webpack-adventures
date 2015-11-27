import React from 'react';
import { connect } from 'react-redux'
import Helmet from "react-helmet";
import ApiClient from '../ApiClient'
import moment from 'moment'
import UserPhoto from '../components/UserPhoto'

let OneStory = React.createClass({

  getInitialState(){
    return {
      story: undefined,
      loading: false,
      failed: false
    }
  },

  componentWillMount(){
    if(this.props.story){
      this.setState({
        story: this.props.story
      })
    }
  },

  componentDidMount(){
    // Only fetch the story if it's different from what the server rendered (via props/initial state)).
    if(!this.props.story || this.props.story.id !== this.props.params.storyId){
      
      this.setState({
        loading: true
      })

      this.fetchStory(this.props.params.storyId)
    }
  },

  componentWillUpdate(nextProps){
    // If param storyId changed we fetch the story and update the UI.
    let currentStoryId = this.props.params.storyId
    let nextStoryId = nextProps.params.storyId
    if(currentStoryId !== nextStoryId){
      this.fetchStory(nextStoryId)
    }
  },
  
  render() {
    let story = this.state.story

    return (
    	<div className="container">
        {this.state.loading ? 'One moment...' : null}
        {!story ? 'Sorry about that, coulnd\'t find that story' : 
          <article className="story-full">
            <header>
              <UserPhoto user={story.user} type='circle' size="small" />
              <h4 className="center">{story.user.name || story.user.username}</h4>
              <time>{moment(story.createdAt).calendar()}</time>
            </header>
            <p className="lead">
              {story.abstract}
            </p>
            <p dangerouslySetInnerHTML={{__html: story.body.replace(/(?:\r\n|\r|\n)/g, '<br />')}}>
            </p>
          </article>
        }
      </div>
  	)
  },

  fetchStory(storyId){
    ApiClient.get('/stories/'+storyId)
      .then((story) => {
        this.setState({
          loading: false,
          failed: false,
          story: story
        })
      }.bind(this))
      .catch((err) => {
        this.setState({
          loading: false,
          failed: true,
          story: undefined
        })
      }.bind(this))
  }

});

function mapStateToProps(state) {
  return { story: state.pub.story }
}

export default connect(mapStateToProps)(OneStory);