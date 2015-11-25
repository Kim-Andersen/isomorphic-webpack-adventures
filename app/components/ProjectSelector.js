import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom';
import _ from 'lodash';
import regex from '../shared/regex'

let ProjectSelector = React.createClass({

  propTypes: {
    projects: PropTypes.arrayOf(PropTypes.object).isRequired,
    defaultProjectId: PropTypes.string,
    onChange: PropTypes.func.isRequired
  },

  componentDidMount(){
    this.input = this.refs.projectName
  },

  render(){
    let defaultProjectId = this.props.defaultProjectId || '';

    return (
      <div className="form-group">
        <label htmlFor="project" className="control-label">Project</label>
        <select 
          onChange={this.onChange} 
          defaultValue={defaultProjectId}
          name="project" 
          ref="project" 
          className="form-control">
          <option value="">Select a project...</option>
          {this.props.projects.map((project, index) => {
            return (<option value={project.id || project._id} key={index}>{project.title}</option>)
          })}
        </select>
      </div>
    )
  },

  onChange(e){
    e.preventDefault()
    console.log('onChange', this.refs.project.value)
    this.props.onChange(this.refs.project.value)
  }

})

export default ProjectSelector