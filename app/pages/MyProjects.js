import React from 'react';
import Helmet from "react-helmet";
import ApiClient from '../ApiClient'
import _ from 'lodash';
import MyProjectsList from '../components/MyProjectsList'
import EditProject from '../components/EditProject'

let MyProjects = React.createClass({

	projectTypes: ['Personal', 'Client'],	

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
      <div className="container">
        <Helmet title="Projects"/>

        <button type="button" 
        	onClick={this.onNewClick}
        	className="btn btn-default">New</button>

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
								project={editProject}
								projectTypes={this.projectTypes}
								onSave={this.onSaveEditedProjectClick}
								onDelete={this.onDeleteProjectClick} /> : null}
        	</div>
        </div>
        
      </div>
    )
  },

  onNewClick(e){
  	e.preventDefault()

		this.setState({
			editProject: {
				title: '',
				type: this.projectTypes[0]
			}
		})  	
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
		let payload = _.pick(project, 'title', 'type', 'startedAt', 'endedAt');
		let projectId = project.id || project._id

		if(projectId){
			ApiClient.patch('/projects/'+projectId, payload)
				.then(this.updateListedProject)
		} else {
			ApiClient.post('/projects', payload)
				.then(this.updateListedProject)
		}
	},

	// Update or add project element in this.state.projects array.
	updateListedProject(project){
		let projects = this.state.projects
		let index = _.indexOf(projects, _.find(projects, {id: project.id}));

		if(index >= 0){
			projects.splice(index, 1, project);	
		} else {
			projects.unshift(project)
		}		

		this.setState({
			projects: projects,
			editProject: undefined
		})
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
			return project.id === projectId
		})

		let updatedState = undefined;
		
		if(removed){
			updatedState = {
				projects: projects	
			}

			if(this.state.editProject && this.state.editProject.id === removed[0].id){
				updatedState['editProject'] = undefined
			}
		}

		if(updatedState){
			this.setState(updatedState)	
		}
		
	}

});

export default MyProjects;