'use strict'
import regex from '../../../../shared/regex'
import me from './me'
import stories from './stories'
import signup from './signup'
import profile from './profile'

export default {
	me: me,
	stories: stories(regex),
	signup: signup,
	profile: profile
}