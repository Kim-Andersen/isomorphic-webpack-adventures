import React, { PropTypes } from 'react'
import moment from 'moment'
import _ from 'lodash'
import ApiClient from '../ApiClient'

let MyProjectsList = React.createClass({

	propTypes: {
  	projects: PropTypes.arrayOf(PropTypes.object).isRequired,
  	onEditClick: PropTypes.func.isRequired,
  	onDeleteClick: PropTypes.func.isRequired
	},

	render(){
		let projectNodes = this.props.projects.map(function(project, index){
			let editClickHandler = (project) => {
				this.props.onEditClick(project)
			}.bind(this)

			let deleteClickHandler = (projectId) => {
				this.props.onDeleteClick(projectId)
			}.bind(this)		

			return (<ProjectListItem 
				project={project} 
				onEditClick={editClickHandler}
				onDeleteClick={deleteClickHandler}
				key={index} />
			)
		}.bind(this))

		return (
			<div>
				{projectNodes ? projectNodes : 'Loading projects...'}
			</div>
		)
	}
})

let ProjectListItem = React.createClass({
	
	propTypes: {
  	project: PropTypes.object.isRequired,
  	onEditClick: PropTypes.func.isRequired,
  	onDeleteClick: PropTypes.func.isRequired
	},

	render(){
		let project = this.props.project

		return(
			<div>
				<h4>
					{project.title}
				</h4>
				<p>
					<a href="#" onClick={this.onEditClick} className="btn btn-link">Edit</a>
					<a href="#" onClick={this.onDeleteClick} className="btn btn-link">Delete</a>
				</p>
			</div>
		)
	},

	onEditClick(e){
		e.preventDefault();
		this.props.onEditClick(this.props.project);
	},

	onDeleteClick(e){
		e.preventDefault();
		this.props.onDeleteClick(this.props.project._id);
	}
})

export default MyProjectsList