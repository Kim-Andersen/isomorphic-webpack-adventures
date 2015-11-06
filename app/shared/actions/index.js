/**
	* action types
	*/
export const TOGGLE_SIGNUP_DIALOG = 'TOGGLE_SIGNUP_DIALOG';

/**
	* action creators
	*/

export function toggleSignupDialog(visible){
	return {
		type: TOGGLE_SIGNUP_DIALOG,
		visible: visible
	};
}