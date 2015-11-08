import { combineReducers } from 'redux'
import stories from './stories'
import composeStory from './composeStory'

export default combineReducers({
	stories,
	composeStory
})