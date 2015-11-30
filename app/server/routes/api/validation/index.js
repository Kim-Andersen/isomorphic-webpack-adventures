'use strict'
import regex from '../../../../shared/regex'
import me from './me'
import story from './story'
import signup from './signup'
import profile from './profile'
import project from './project'
import activity from './activity'

export default {
	me: me,
	story: story(regex),
	signup: signup,
	profile: profile,
	project: project(regex),
	activity: activity(regex)
}