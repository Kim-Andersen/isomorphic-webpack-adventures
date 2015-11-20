import React, { PropTypes } from 'react'
import _ from 'lodash'

let EditProject = React.createClass({
	
	propTypes: {
  	project: PropTypes.object.isRequired,
  	onSave: PropTypes.func.isRequired,
  	onDelete: PropTypes.func.isRequired
	},

	render(){
		let project = this.props.project

		return (
			<form onSubmit={this.onSubmit}>
				<div className="form-group text-left">
          <label htmlFor="title" className="control-label">Title</label>
          <input type="text" 
          	name="title" 
          	ref="title" 
          	defaultValue={project.title} 
          	placeholder="Name the project" 
          	className="form-control" 
          	/>
        </div>          

        <button type="submit" className="btn btn-default">Save</button>
			</form>
		)
	},

	onSubmit(e){
		e.preventDefault()
		
		let editedProject = _.extend({}, this.props.project, {
			title: _.trim(this.refs.title.value)
		})

		this.props.onSave(editedProject);
	}
})

export default EditProject