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

		let longTextSnippet = undefined
		if(activity.longTextSnippet){
			longTextSnippet = activity.longTextSnippet + '...'
		}

		let projectNode = activity.project && (
			<span className="project">
				<span className="in"> in project </span>
				<Link to={'/kim/projects/'+activity.project._id}>{activity.project.title}</Link>
			</span>)

		return(
			<article className={'type-'+Classnames(activity.type)}>
				<h6 className="type">{activity.type}</h6>
				<p>
					{activity.shortText}
					{projectNode}
				</p>
				{longTextSnippet ? 
					<p className="story-snippet">
						{longTextSnippet} <span>&nbsp;<Link to={'/kim/update/'+activity._id} className="readmore anchor">Read&nbsp;more</Link></span>
					</p>
				: null}
			</article>
		)
	}

})

export default ActivityTimeline