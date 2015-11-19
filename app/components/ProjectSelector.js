import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom';
import _ from 'lodash';
import regex from '../shared/regex'

let ProjectSelector = React.createClass({

  getInitialState: function(){
    return {
      projects: ['Hola', 'Virego', 'FOSS']
    }
  },

  componentDidMount(){
    this.input = this.refs.projectName
  },

  render(){
    return (
      <div className="project-selector">
        <div className="form-group">
          <input type="text" 
            ref="projectName"
            className="form-control" 
            placeholder="Related to a client or project?" />
        </div>
      </div>
    )
  },



})

export default ProjectSelector