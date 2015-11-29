import React, { PropTypes } from 'react'
import moment from 'moment'
import { Link } from 'react-router';
import Classnames from 'classnames'
import _ from 'lodash'

let ActivityTimeline = React.createClass({
	propTypes: {
  	activities: PropTypes.array.isRequired
	},

	render(){
		let nodes = this.props.activities.map(function(activity, index){
			return (
				<ActivityTimelineItem 
					key={index} 
					activity={activity} />
			)
		})

		return (
			<div className={Classnames('activity-timeline')}>
				{nodes}
			</div>
		)
	}
})

let ActivityTimelineItem = React.createClass({
	propTypes: {
  	activity: PropTypes.object.isRequired
	},

	render(){
		let activity = this.props.activity

		let projectNode = activity.project && (
			<span className="project">
				<span className="in"> in project </span>
				<a href="#">{activity.project.title}</a>
			</span>)

		let storySnippetNode = null
		if(activity.story){
			let storyText = activity.story.body
			let storyTextShortened = false
			if(activity.story.body.length > 200) {
				storyText = activity.story.body.substring(0,200) + '...'
				storyTextShortened = true
			} 
			storySnippetNode = (
				<p className="story-snippet">
					{storyText}
					{storyTextShortened ? <span>&nbsp;<a href="#" className="readmore anchor">Read&nbsp;more</a></span> : null}
				</p>
			)
		}

		return(
			<article className={'type-'+Classnames(activity.type)}>
				<h6 className="type">{activity.type}</h6>
				<p>
					{activity.text}
					{projectNode}
				</p>
				{storySnippetNode}
			</article>
		)
	}

})

export default ActivityTimeline