import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import {Overlay, OverlayDialog} from '../Overlay';
import WriteDialog from './WriteDialog';
import { writeStoryOverlay as actionCreators } from '../../shared/actions/'
 
let WriteStoryOverlay = React.createClass({

	propTypes: {
  	onCloseClick: PropTypes.func.isRequired
	},

	render(){
		let Dialog = this.getDialog(this.props.dialog)
		const { dispatch } = this.props

		return (
			<Overlay show={true} onClose={this.props.onCloseClick}>
				<OverlayDialog classNames="overlay-dialog-write-story">
					{Dialog}
				</OverlayDialog>
			</Overlay>
		)
	},

	getDialog(dialog){
		switch(dialog){
			case 'WRITE':
			default:
				return <WriteDialog onSave={this.onDone} />
		}
	},

	setDialog(dialog){
		this.props.dispatch(actionCreators.setDialog(dialog));
	},

	onDone(){
		this.props.dispatch(actionCreators.clear())
	}

});

export default connect((state) => state.writeStoryOverlay)(WriteStoryOverlay)