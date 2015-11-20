import React from 'react';
import Helmet from "react-helmet";
import ApiClient from '../ApiClient'
import _ from 'lodash';
import MyProjectsList from '../components/MyProjectsList'
import EditProject from '../components/EditProject'

let MyProjects = React.createClass({

	getInitialState(){
		return {
			projects: [],
			editProject: undefined
		}
	},

	componentDidMount(){
		this.fetchStories();
	},
  
  render() {
  	let showProjectsList = this.state.projects && this.state.projects.length > 0
  	let editProject = this.state.editProject

    return (
      <div>
        <Helmet title="Projects"/>

        <div className="row">
        	<div className="col-xs-12 col-sm-6">
        		{showProjectsList ? 
	        		<MyProjectsList
	        			projects={this.state.projects}
	        			onEditClick={this.onEditProjectClick}
	        			onDeleteClick={this.onDeleteProjectClick} />
        		: null}
        	</div>
        	<div className="col-xs-12 col-sm-6">
						{editProject ? 
							<EditProject 
								project={this.state.editProject} 
								onSave={this.onSaveEditedProjectClick}
								onDelete={this.onDeleteProjectClick} /> : null}
        	</div>
        </div>
        
      </div>
    )
  },

  fetchStories(){
		ApiClient.get('/me/projects?limit=200')
			.then((projects) => {
				this.setState({
					projects: projects
				})
			}.bind(this))
	},

	onSaveEditedProjectClick(project){
		let payload = _.pick(project, 'title');
		let projectId = project.id || project._id
		ApiClient.patch('/projects/'+projectId, payload)
			.then((project) => {
				
				// Update edited project in this.state.projects array.
				let projects = this.state.projects
				let index = _.indexOf(projects, _.find(projects, {id: project.id}));
				projects.splice(index, 1, project);				

				this.setState({
					projects: projects,
					editProject: undefined
				})
			}.bind(this))
	},

	onDeleteProjectClick(projectId){
		this.deleteProject(projectId);
	},

	deleteProject(projectId){
		if(confirm('Sure you want to delete this project permanently?')){
			return ApiClient.delete('/projects/'+projectId)
				.then(() => {
					this.removeItem(projectId);
				}.bind(this));	
		}
	},

	onDeleteProjectClick(projectId){
		this.deleteProject(projectId);		
	},

	onEditProjectClick(project){
		this.setState({
			editProject: project
		})
	},

	removeItem(projectId){
		let projects = this.state.projects
		
		let removed = _.remove(projects, (project) => {
			return project._id == projectId
		})
		
		if(removed){
			this.setState({
				projects: projects
			})
		}
	}

});

export default MyProjects;