import React, { PropTypes } from 'react'
import _ from 'lodash'
import moment from 'moment'
import { YearSelector,  MonthSelector} from './DateSelectors'

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
			<form onSubmit={this.onSubmit} onChange={_.once(this.onFormChange)}>

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

        <div className="form-group">
          <label className="control-label">Time period</label>

          <div className="row">
            <div className="col-xs-12 col-md-6">

              <div className="row">
                <div className="col-xs-6">
                  <MonthSelector
                    onChange={this.onStartedAtMonthChange} 
                    month={this.state.startedAt.month}/>
                </div>
                <div className="col-xs-6">
                  <YearSelector 
                    onChange={this.onStartedAtYearChange} 
                    year={this.state.startedAt.year} />
                </div>
              </div>

            </div>

            <div className="col-xs-12 col-md-6">

              <div className="row">
                <div className="col-xs-6">
                  <MonthSelector 
                    onChange={this.onEndedAtMonthChange} 
                    month={this.state.endedAt.month}/>
                </div>
                <div className="col-xs-6">
                  <YearSelector 
                    onChange={this.onEndedAtYearChange} 
                    year={this.state.endedAt.year} />
                </div>
              </div>

            </div>

          </div>
        </div>

        <button 
          type="submit" 
          disabled={!this.state.formChanged}
          className="btn btn-default">Save</button>
			</form>
		)
	},

  getInitialState(){
    let project = _.extend({}, this.getDefaultProject(), this.props.project)

    return {
      formChanged: false,
      startedAt: project.startedAt,
      endedAt: project.endedAt
    }
  },

  componentWillReceiveProps(props){
    if(props.project){
      let project = _.extend({}, this.getDefaultProject(), props.project)
      
      this.setState({
        formChanged: false,
        startedAt: project.startedAt,
        endedAt: project.endedAt
      })

      this.refs.title.value = project.title
      this.refs.type.value = project.type.toLowerCase()
    }
  },

  getDefaultProject(){
    let thisYear = moment().year()
    let thisMonth = moment().month()

    return {
      title: '',
      type: this.props.projectTypes[0],
      startedAt: {
        year: thisYear,
        month: thisMonth
      },
      endedAt: {
        year: thisYear,
        month: thisMonth
      }
    }
  },

  onFormChange(){
    this.setState({
      formChanged: true
    })
  },

  onStartedAtMonthChange(month){
    let startedAt = this.state.startedAt
    let endedAt = this.state.endedAt    
    
    startedAt.month = month
    if(startedAt.year === endedAt.year && month > endedAt.month){
      endedAt.month = month
    }

    this.setState({
      startedAt: startedAt,
      endedAt: endedAt
    })
  },

  onEndedAtMonthChange(month){
    let startedAt = this.state.startedAt
    let endedAt = this.state.endedAt

    endedAt.month = month
    if(startedAt.year === endedAt.year && month < startedAt.month){
      startedAt.month = month
    }

    this.setState({
      startedAt: startedAt,
      endedAt: endedAt
    })
  },

  onStartedAtYearChange(year){
    let endedAt = this.state.endedAt
    let startedAt = this.state.startedAt

    startedAt.year = year
    
    if(startedAt.year > endedAt.year){
      endedAt.year = startedAt.year
    }
    
    this.setState({
      startedAt: startedAt,
      endedAt: endedAt
    })
  },

  onEndedAtYearChange(year){
    let endedAt = this.state.endedAt
    let startedAt = this.state.startedAt

    endedAt.year = year
    
    if(endedAt.year < startedAt.year){
      startedAt.year = endedAt.year
    }
    
    this.setState({
      startedAt: startedAt,
      endedAt: endedAt
    })
  },

	onSubmit(e){
		e.preventDefault()
		
		let project = _.extend({}, this.props.project, {
			title: _.trim(this.refs.title.value),
			type: _.trim(this.refs.type.value.toLowerCase()),
      startedAt: this.state.startedAt,
      endedAt: this.state.endedAt
		})

		this.props.onSave(project);
	}
})

export default EditProject