import React, { PropTypes } from 'react'
import classnames from 'classnames';
import InlineStoryComposer from '../InlineStoryComposer'

let WriteDialog = React.createClass({

	propTypes: {
  	onSave: PropTypes.func.isRequired
	},

  render() {
    return (
      <InlineStoryComposer 
        onStorySaved={this.onStorySaved} />
    )
  },

  onStorySaved(story){
  	this.props.onSave()
  }

});

export default WriteDialog;