let regex = {
	OBJECT_ID: /^[a-fA-F0-9]{24}$/, // https://github.com/Automattic/mongoose/issues/1959
	TAG: /^[a-zA-Z0-9_ -]*$/ // letters A-Z, numbers, spaces, and dashes.
}

export default regex;