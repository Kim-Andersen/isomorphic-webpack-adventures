import React, { PropTypes } from 'react'
import _ from 'lodash'

let EditProject = React.createClass({
	
	propTypes: {
  	project: PropTypes.object.isRequired,
  	projectTypes: PropTypes.array.isRequired,
  	onSave: PropTypes.func.isRequired,
  	onDelete: PropTypes.func.isRequired
	},

  getInitialState(){
    return {
      title: '',
      type: ''
    }
  },

  componentDidMount(){
    this.updateState(this.props.project)
  },

  componentWillReceiveProps(nextProps){
    this.updateState(nextProps.project)
  },

  updateState(project){
    console.log('updateState', project)
    this.setState(_.extend({
      title: '', 
      type: this.props.projectTypes[0]
    }, project))
  },

	render(){
		let project = this.props.project
    let typeValue = this.state.type.toLowerCase() || ''
    console.log('typeValue', typeValue)

		return (
			<form onSubmit={this.onSubmit}>
				<div className="form-group text-left">
          <label htmlFor="title" className="control-label">Title</label>
          <input type="text" 
          	name="title" 
          	ref="title"
            defaultValue={this.state.title} 
            value={this.state.title} 
            onChange={this.onTitleChange}
          	placeholder="Name the project" 
          	className="form-control" 
          	/>
        </div>

        <div className="form-group">
          <label htmlFor="type" className="control-label">Type</label>
          <select 
            value={typeValue}
            defaultValue={typeValue}
            ref="type" 
            onChange={this.onTypeChange}
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

  onTitleChange(e){
    e.preventDefault()

    this.setState({
      title: _.trim(this.refs.title.value)
    })
  },

  onTypeChange(e){
    e.preventDefault()

    this.setState({
      type: _.trim(this.refs.type.value)
    })
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