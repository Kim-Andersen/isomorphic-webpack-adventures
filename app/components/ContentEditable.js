import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom';
import _ from 'lodash';

let ContentEditable = React.createClass({

  propTypes: {
    singleLine: PropTypes.bool,
    whitelistRegex: PropTypes.string
  },

  KeyCodes: {
    BACKSPACE: 8,
    TAB: 9,
    ENTER: 13
  },

  componentDidMount(){
    this.DOMNode = ReactDOM.findDOMNode(this)
  },
  
  onKeyDown(e){
    let keyCode = e.keyCode
    
    if(keyCode == this.KeyCodes.BACKSPACE && 
      this.DOMNode.innerHTML.length === 0 
      &&_.isFunction(this.props.onEmptyBackspace)){

      this.props.onEmptyBackspace();
    }
    
    if(this.props.singleLine === true && keyCode == this.KeyCodes.ENTER){
      e.preventDefault();
    }

    if(keyCode == this.KeyCodes.TAB){
      if(_.isFunction(this.props.onTabKey)){
        e.preventDefault();
        let html = this.DOMNode.innerHTML
        this.props.onTabKey(html);
      }      
    }

    if(keyCode == this.KeyCodes.ENTER){
      if(_.isFunction(this.props.onEnterKey)){
        e.preventDefault();
        let html = this.DOMNode.innerHTML
        this.props.onEnterKey(html);
      }      
    }
  },

  onKeyPress(e){
    if(this.props.whitelistRegex){
      let key = e.key
      let re = new RegExp(this.props.whitelistRegex)
      let isValid = re.test(key)
      if(!isValid){
        e.preventDefault()
        if(_.isFunction(this.props.onInvalidInput)){
          this.props.onInvalidInput();
        }
      }
    }    
  },

  render(){
    return (
      <div 
        onInput={this.emitChange} 
        onBlur={this.emitChange}
        contentEditable={true}
        dangerouslySetInnerHTML={{__html: this.props.html}}
        onKeyDown={this.onKeyDown}
        onKeyPress={this.onKeyPress}
        ></div>
    )
  },

  shouldComponentUpdate(nextProps){
    return nextProps.html !== this.DOMNode.innerHTML;
  },

  componentDidUpdate: function() {
    if ( this.props.html !== this.DOMNode.innerHTML ) {
      this.DOMNode.innerHTML = this.props.html;
    }
  },

  emitChange(){
    var html = this.DOMNode.innerHTML;
    if (this.props.onChange && html !== this.lastHtml) {
      this.props.onChange(html);
    }
    this.lastHtml = html;
  }
})

export default ContentEditable