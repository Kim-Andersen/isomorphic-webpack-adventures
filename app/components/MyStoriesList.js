import React, { PropTypes } from 'react'
import moment from 'moment'
import _ from 'lodash'
import ApiClient from '../ApiClient'

let MyStoriesList = React.createClass({

	getInitialState(){
		return {
			stories: []
		}
	},

	componentDidMount(){
		this.fetchStories();
	},

	render(){
		let storyNodes = this.state.stories.map(function(story, index){
			var deleteClickHandler = (storyId) => {
				this.onDeleteClick(storyId)
			}.bind(this)

			return (<StoryListItem 
				story={story} 
				onDeleteClick={deleteClickHandler}
				key={index} />
			)
		}.bind(this))

		return (
			<div>
				{storyNodes ? storyNodes : 'Loading stories...'}
			</div>
		)
	},

	fetchStories(){
		ApiClient.get('/me/stories?limit=200')
			.then((stories) => {
				this.setState({
					stories: stories
				})
			}.bind(this))
	},

	onDeleteClick(storyId){
		if(confirm('Sure you want to delete this story permanently?')){
			ApiClient.delete('/stories/'+storyId)
				.then(() => {
					this.removeItem(storyId);
				}.bind(this));	
		}
		
	},

	removeItem(storyId){
		let stories = this.state.stories
		
		let removed = _.remove(stories, (story) => {
			return story._id == storyId
		})
		
		if(removed){
			this.setState({
				stories: stories
			})
		}
	}
})

let StoryListItem = React.createClass({
	
	propTypes: {
  	story: PropTypes.object.isRequired
	},

	render(){
		let story = this.props.story

		return(
			<div className="row">
				<div className="col-xs-12 col-sm-2 text-xs-left text-sm-right">
					{moment(story.createdAt).format('MMM DD')}
				</div>
				<div className="col-xs-12 col-sm-10">
					<p>{story.textShort}</p>
					{story.hashtags && story.hashtags.map(function(hashtag, index){
      			return (<a href="#" key={index}>#{hashtag}&nbsp;</a>)
      		})}
      		{story.isPublished ? 'Draft' : null}
      		<a href="" onClick={this.onDeleteClick} className="btn btn-link">Delete</a>
				</div>
			</div>
		)
	},

	onDeleteClick(e){
		e.preventDefault();
		if(_.isFunction(this.props.onDeleteClick)){
			this.props.onDeleteClick(this.props.story._id);
		}
	},
})

export default MyStoriesList