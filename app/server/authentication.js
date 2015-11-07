import _ from 'lodash';
import passport from 'passport'
import LocalStrategy from 'passport-local'
import { User } from '../../models'

export function initAuthentication(){

	passport.use(new LocalStrategy({
		usernameField: 'email',
	}, function verifyCallback(email, password, done) {
		User.findOne({ email: email }, function (err, user) {
	    if (err) { return done(err); }

	    // No user found with that email
	    if (!user) { return done(null, false); }

	    // Make sure the password is correct
	    user.verifyPassword(password, function(err, isMatch) {
	      if (err) { return done(err); }

	      // Password did not match
	      if (!isMatch) { return done(null, false); }

	      // Success
	      return done(null, user);
	    });
	  });
	}));

	passport.serializeUser(function(user, done) {
	  done(null, user.id);
	});

	//  When requests are received, this id is used to find the user, which will be restored to req.user.
	passport.deserializeUser(function(id, done) {
	  if(_.isObject(id)) id = id._id;

	  User.findById(id, function(err, user){
	    if (err) {
	      done(err, null)
	    } else done(err, user);
	 })
	});

}