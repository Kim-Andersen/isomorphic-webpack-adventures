import React, { PropTypes } from 'react'
import moment from 'moment'

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
					<p>{story.text}</p>
					{story.hashtags && story.hashtags.map(function(hashtag, index){
      			return (<a href="#" key={index}>#{hashtag}&nbsp;</a>)
      		})}
				</div>
			</div>
		)
	}
})

let StoryList = React.createClass({
	propTypes: {
  	stories: PropTypes.array.isRequired
	},

	render(){
		let storyNodes = this.props.stories.map(function(story, index){
			return (<StoryListItem story={story} key={index} />)
		})

		return (
			<div>
				{storyNodes}
			</div>
		)
	}
})



export default StoryList