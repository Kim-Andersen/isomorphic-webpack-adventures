import React, { PropTypes } from 'react'
import _ from 'lodash'
import moment from 'moment'

let YearSelector = React.createClass({
  propTypes: {
    onChange: PropTypes.func.isRequired,
    year: PropTypes.number
  },

  getInitialState(){
    return {
      year: this.props.year
    }
  },

  componentWillReceiveProps(props){
    if(props.year != this.state.year){
      this.setState({
        year: props.year
      })
    }    
  },

  render(){
    let year = moment().year()
    let years = []
    for(let i=0; i<10; i++){
      years.push(year-i)
    }

    return (
      <select 
        className="form-control"
        onChange={this.onChange}
        value={this.state.year}>
        {years.map((year, index) => {
          return <option value={year} key={index}>{year}</option>
        })}
      </select>
    )
  },

  onChange(e){
    e.preventDefault
    this.props.onChange(parseInt(e.target.value, 10))
  }
})

let MonthSelector = React.createClass({
  propTypes: {
    onChange: PropTypes.func.isRequired,
    month: PropTypes.number
  },

  getInitialState(){
    return {
      month: this.props.month
    }
  },

  componentWillReceiveProps(props){
    if(props.month != this.state.month){
      this.setState({
        month: props.month
      })
    }    
  },

  render(){
    let months = moment.months()
    
    return (
      <select 
        value={this.state.month}
        className="form-control"
        onChange={this.onChange}>
        {months.map((month, index) => {
          return <option value={index} key={index}>{month}</option>
        })}
      </select>
      )
  },

  onChange(e){
    e.preventDefault
    this.props.onChange(parseInt(e.target.value, 10))
  }
})

export default { YearSelector,  MonthSelector}