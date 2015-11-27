import React, { PropTypes } from 'react'
import moment from 'moment'
import { Link } from 'react-router';
import Classnames from 'classnames'
import _ from 'lodash'

let StoryTimeline = React.createClass({
	propTypes: {
  	stories: PropTypes.array.isRequired,
  	storyBaseUri: PropTypes.string.isRequired,
  	mode: PropTypes.oneOf(['kickstarter', 'timothy', 'hybrid'])
	},

	render(){
		let storyBaseUri = this.props.storyBaseUri

		let storyNodes = this.props.stories.map(function(story, index){
			let position = index % 2 === 0 ? 'even' : 'odd'
			return (
				<StoryTimelineItem 
					key={index} 
					storyBaseUri={storyBaseUri}
					story={story} 					
					position={position} />
			)
		})

		return (
			<div className={Classnames('story-timeline', 'mode-'+this.props.mode)}>
				{storyNodes}
			</div>
		)
	}
})

let StoryTimelineItem = React.createClass({
	propTypes: {
  	story: PropTypes.object.isRequired,
  	position: PropTypes.oneOf(['even', 'odd']),
  	storyBaseUri: PropTypes.string.isRequired
	},

	render(){
		let story = this.props.story
		let className = 'story-timeline-item '+this.props.position
		let mCreatedAt = moment(story.createdAt)
		let uri = this.props.storyBaseUri+story._id

		/*return (
			<div className="row">
				<div className="col-xs-12 col-sm-3 col-md-2">
					<time dateTime={mCreatedAt.toISOString()}>{mCreatedAt.format('MMMM DD')}</time>
				</div>
				<div className="col-xs-12 col-sm-9 col-md-10">
					<p>
						{story.abstract}<br/>
						{story.hasBody ? <span className="anchor">Read&nbsp;more</span> : null}
					</p>
					<ul className="tag-list">
						{story.hashtags && story.hashtags.map(function(hashtag, index){
		      		return (<li key={index}>{hashtag} </li>)
		      	})}
					</ul>
				</div>
			</div>
		)*/
		
		return(
			<article className={className}>
				<Link to={uri} className="content">
					<time dateTime={mCreatedAt.toISOString()}>{mCreatedAt.format('MMM DD')}</time>
					<section>
						<p className="lead">
							{story.abstract}
						</p>
						<p className="body">
							{_.trim(story.bodyExcerpt)+'...'}
							{story.hasBody ? <span className="readmore anchor">Read&nbsp;more</span> : null}
						</p>
						<ul className="tag-list">
							{story.tags && story.tags.map(function(hashtag, index){
			      		return (<li key={index}>{hashtag} </li>)
			      	})}
						</ul>
					</section>
				</Link>
			</article>
		)
	}
})

export default StoryTimeline