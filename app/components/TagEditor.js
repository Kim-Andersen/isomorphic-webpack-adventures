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

  render(){
    let tags = this.state.tags || [];
    let tagRegex = '^[a-zA-Z0-9_ -]*$' // letters A-Z, numbers, spaces, and dashes.

    let tagNodes = tags.map(function(tag, index){
      return (
        <div className="tag" key={index}>{tag} 
          <button type="button" 
            onClick={this.removeTag.bind(this, index)}
            className="btn btn-link btn-xs remove-tag">x</button>
        </div>)
    }, this)

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
              onEnterKey={this.onInputEnterKey}
              onEmptyBackspace={this.onInputEmptyBackspace} 
              onChange={this.onInputChange}
              />
              <span ref="inputPlaceholder" className="default-value">Add a tag...</span>
            </div>
        </div>        
      </div>
    )
  },

  componentDidMount(){
    // Cache DOM node references.
    this.$tagInput = $(ReactDOM.findDOMNode(this.refs.tagInput))
    this.$tagInput.popover({
      content: '',
      placement: 'bottom',
      trigger: 'manual',
      container: 'body'
    })

    this.$inputPlaceholder = $(ReactDOM.findDOMNode(this.refs.inputPlaceholder))
  },

  componentWillUnmount(){
    this.$tagInput.popover('destroy')
  },

  onInputChange(tag){
    if(tag.length === 0){
      this.toggleInputPlaceholder(true);
    } else {
      this.toggleInputPlaceholder(false);
      this.hidePopover();
    }
  },

  onInputEmptyBackspace(){
    if(this.state.tags.length > 0){
      this.setState({
        tags: _.initial(this.state.tags)
      })

      this.$tagInput.popover('hide');
      this.toggleInputPlaceholder(true);
      this.hidePopover();
    }    
  },

  onInvalidInput(){
    this.showPopover(this.PopoverContent.INVALID_TAG);
  },

  onInputTabKey(tag){
    if(tag.length > 0){
      this.addTag(tag);      
    }
  },

  onInputEnterKey(tag){
    if(tag.length > 0){
      this.addTag(tag);      
    }
  },

  addTag(tag){
    tag = _.trim(tag)
    let tags = this.state.tags || []
    let tagExists = false

    _.forEach(tags, function(_tag){
      if(_tag.toLowerCase() == tag.toLowerCase()){
        tagExists = true
      }
    })

    if(tagExists){
      this.showPopover(this.PopoverContent.TAG_EXISTS);
    } else {
      tags.push(tag)
      this.setState({
        tags: tags
      })

      this.toggleInputPlaceholder(true);
      this.hidePopover();

      if(_.isFunction(this.props.onChange)){
        this.props.onChange(this.state.tags);
      }
    }
  },

  removeTag(index){
    if(_.remove(this.state.tags, (tag, _index) => {
      return _index === index
    })) {
      this.setState({
        tags: this.state.tags
      })
    }
  },

  toggleInputPlaceholder(show){
    if(show) {
      this.$inputPlaceholder.fadeIn(150)
    } else {
      this.$inputPlaceholder.hide()
    }
  },

  PopoverContent: {
    TAG_EXISTS: 'You have already added this tag.',
    INVALID_TAG: 'Tags only support letters A-Z, numbers, spaces, and dashes.'
  },

  showPopover(content){
    if(this.tagPopoverTimer){
      window.clearTimeout(this.tagPopoverTimer)
    }

    this.$tagInput.data('bs.popover').options.content = content
    this.$tagInput.popover('show')
    
    this.tagPopoverTimer = window.setTimeout(this.hidePopover, 5000)
  },

  hidePopover(){
    this.$tagInput.popover('hide')
    if(this.tagPopoverTimer){
      window.clearTimeout(this.tagPopoverTimer)
    }
  }
})

export default TagEditor