import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom';
import ContentEditable from './ContentEditable'
import _ from 'lodash';

let TagEditor = React.createClass({
  getInitialState: function(){
    return {
      tags: []
    }
  },

  componentDidMount(){
    this.$tagInput = $(ReactDOM.findDOMNode(this.refs.tagInput))
      .popover({
        content: 'Tags only support letters A-Z, numbers, spaces, and dashes.',
        placement: 'bottom',
        trigger: 'manual',
        viewport: {'selector': 'body'}
      });

    this.$inputPlaceholder = $(ReactDOM.findDOMNode(this.refs.inputPlaceholder))
  },

  render(){
    let tags = this.state.tags || [];
    let tagRegex = '^[a-zA-Z0-9_ -]*$' // letters A-Z, numbers, spaces, and dashes.

    let tagNodes = tags.map(function(tag, index){
      return (<div className="tag" key={index}>{tag}</div>)
    })

    return (
      <div className="tag-editor">
        <div className="tags">
          {tagNodes}
          <div className="input-wrapper">
            <ContentEditable html={''} 
              ref="tagInput"
              singleLine={true}
              whitelistRegex={tagRegex}
              onInvalidInput={this.onInvalidInput}
              onTabKey={this.onInputTabKey}
              onEmptyBackspace={this.onInputEmptyBackspace} 
              onChange={this.onInputChange}
              />
              <span ref="inputPlaceholder" className="default-value">Add a tag...</span>
            </div>
        </div>        
      </div>
    )
  },

  toggleInputPlaceholder(show){
    if(show) {
      this.$inputPlaceholder.fadeIn(150)
    } else {
      this.$inputPlaceholder.hide()
    }
  },

  onInputChange(e){
    if(e.target.value.length === 0){
      this.toggleInputPlaceholder(true);
    } else {
      this.toggleInputPlaceholder(false);
    }
  },

  onInputEmptyBackspace(){
    if(this.state.tags.length > 0){
      this.setState({
        tags: _.initial(this.state.tags)
      })

      this.$tagInput.popover('hide');
      this.toggleInputPlaceholder(true);
    }    
  },

  onInvalidInput(){
    console.log('Tags only support letters A-Z, numbers, spaces, and dashes.')
    this.$tagInput.popover('show');

    if(this.tagPopoverTimer){
      window.clearTimeout(this.tagPopoverTimer);
    }
    
    this.tagPopoverTimer = window.setTimeout(() => {
      this.$tagInput.popover('hide');
    }.bind(this), 5000)
  },

  onInputTabKey(tag){
    if(tag.length > 0){
      let tags = this.state.tags || []
      tags.push(tag)
      
      this.setState({
        tags: tags
      })

      this.toggleInputPlaceholder(true);

      if(_.isFunction(this.props.onChange)){
        this.props.onChange(this.state.tags);
      }
    }
  },

})

export default TagEditor