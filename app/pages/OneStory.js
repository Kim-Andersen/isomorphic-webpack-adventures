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
    let displayName = this.getDisplayName(story.user)
    let userPhoto = (<UserPhoto user={story.user} type='circle' size="small" />)

    return (
    	<div className="container">
        {this.state.loading ? 'One moment...' : null}
        {!story ? 'Sorry about that, coulnd\'t find that story' : 
          <article className="story-full">
            <header>
              <div className="row">
                <div className="col-xs-12 col-sm-7">
                  {userPhoto}
                  {displayName}
                </div>
                <div className="col-xs-12 col-sm-5 text-xs-left text-sm-right">
                  <time>{moment(story.createdAt).calendar()}</time>
                </div>
              </div>
            </header>
            <p className="lead">
              {story.abstract}
            </p>
            <p dangerouslySetInnerHTML={{__html: story.body.replace(/(?:\r\n|\r|\n)/g, '<br />')}}>
            </p>
            <footer>
              <ul className="tag-list">
                {story.tags && story.tags.map(function(hashtag, index){
                  return (<li key={index}>{hashtag} </li>)
                })}
              </ul>
            </footer>
          </article>
        }
      </div>
  	)
  },

  getDisplayName(user){
    let name = ''
    if(user.profile && user.profile.name && user.profile.name.length > 0){
      name = user.profile.name
    } else {
      name = user.name || user.username
    }
    return name
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