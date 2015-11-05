import React from 'react';
import classnames from 'classnames';

let Overlay = React.createClass({

	propTypes: {
		showCloseButton: React.PropTypes.bool
	},

	getDefaultProps: function() {
    return {
      showCloseButton: true
    };
  },

  render() {
    return (
      <div className="overlay">
				{this.props.showCloseButton ? <button onClick={this.props.onClose} className="overlay-close btn btn-link">x</button> : null}
				{this.props.children}
			</div>
    )
  }
});

let OverlayDialog = React.createClass({
  propTypes: {
    animate: React.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      animate: true
    };
  },

  render() {
    return (
      <div className={classnames('overlay-dialog', {'overlay-dialog-animate': this.props.animate}, this.props.classNames)}>
        {this.props.children}
      </div>
    )
  }
});

export {Overlay, OverlayDialog};
