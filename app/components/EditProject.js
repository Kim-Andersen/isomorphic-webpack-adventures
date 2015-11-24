import React, { PropTypes } from 'react'
import _ from 'lodash'

let EditProject = React.createClass({
	
	propTypes: {
  	project: PropTypes.object.isRequired,
  	projectTypes: PropTypes.array.isRequired,
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

        <div className="form-group">
          <label htmlFor="type" className="control-label">Type</label>
          <select 
            defaultValue={project.type.toLowerCase()}
            ref="type" 
            className="form-control">
          	{this.props.projectTypes.map((type, index) => {
          		return <option value={type.toLowerCase()} key={index}>{type}</option>
          	})}
          </select>
        </div>          

        <button type="submit" className="btn btn-default">Save</button>
			</form>
		)
	},

	onSubmit(e){
		e.preventDefault()
		
		let project = _.extend({}, this.props.project, {
			title: _.trim(this.refs.title.value),
			type: _.trim(this.refs.type.value.toLowerCase())
		})

		this.props.onSave(project);
	}
})

export default EditProject