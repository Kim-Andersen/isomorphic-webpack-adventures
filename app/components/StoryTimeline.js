import React, { PropTypes } from 'react'
import moment from 'moment'
import { Link } from 'react-router';

let StoryTimelineItem = React.createClass({
	propTypes: {
  	story: PropTypes.object.isRequired,
  	position: PropTypes.oneOf(['left', 'right']),
  	storyBaseUri: PropTypes.string.isRequired
	},

	render(){
		let story = this.props.story
		let className = 'story-timeline-item '+this.props.position
		let mCreatedAt = moment(story.createdAt)
		let uri = this.props.storyBaseUri+story._id

		return(
			<div className={className}>
				<Link to={uri} className="content">
					<time dateTime={mCreatedAt.toISOString()}>{mCreatedAt.format('MMMM DD')}</time>
					<p>{story.text}</p>
					<div>
					{story.hashtags && story.hashtags.map(function(hashtag, index){
	      		return (<span href="#" key={index}>{hashtag} </span>)
	      	})}
					</div>
					
				</Link>
			</div>
		)
	}

})

let StoryTimeline = React.createClass({
	propTypes: {
  	stories: PropTypes.array.isRequired,
  	storyBaseUri: PropTypes.string.isRequired
	},

	render(){
		let storyBaseUri = this.props.storyBaseUri

		let storyNodes = this.props.stories.map(function(story, index){
			let position = index % 2 === 0 ? 'left' : 'right'
			return (
				<StoryTimelineItem 
					key={index} 
					storyBaseUri={storyBaseUri}
					story={story} 					
					position={position} />
			)
		})

		return (
			<div className="story-timeline">
				{storyNodes}
			</div>
		)
	},

	onStoryClick(storyId){
		console.log('onStoryClick', storyId)
	}
})



export default StoryTimeline