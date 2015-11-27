export const SHOW = 'SHOW'
export const HIDE = 'HIDE'
export const CLEAR = 'CLEAR'
export const DIALOGS = {
	WRITE: 'WRITE'
};

/* Action creators
*****************************************************************************/

let writeStoryOverlay = {
	show(){
		return {
			type: SHOW
		}	
	},
	hide(){
		return {
			type: HIDE
		}	
	},
	clear(){
		return {
			type: CLEAR
		}
	}
}

export default writeStoryOverlay

