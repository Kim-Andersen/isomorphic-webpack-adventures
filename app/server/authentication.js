import express from 'express';
import passport from 'passport'
import LocalStrategy from 'passport-local'
import TwitterStrategy from 'passport-twitter'
import _ from 'lodash'
import { User } from '../../models/'

export default function authentication(){

	// ================================================================
	//	Serializing / Deserializing
	// ================================================================

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
	
	// ================================================================
	// 	Strategies
	// ================================================================

	passport.use(new LocalStrategy({
		usernameField: 'email',
		}, 
		function verifyCallback(email, password, done) {
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
		}
	));

	passport.use(new TwitterStrategy({
		consumerKey: 'bK3fQIpXepJ05vbDMdTbcIyR8',
    consumerSecret: 'XRHSeN5N6dWFLT41BdH4yuNPB3wpcFngETV9SZbY2FcbAixwG6',
    callbackURL: 'http://localhost:3000/auth/twitter/callback',
    passReqToCallback: true
	}, function verifyCallback(req, token, tokenSecret, profile, done){
		process.nextTick(function(){

			// check if the user is already logged in
			if(!req.user){
				User.findOne({'twitter.id': profile.id}, 
					function(err, user){
						if(err){
							return done(err);
						} else if(user){
							return done(null, user);
						} else {
							var newUser = new User();
							newUser.twitter.id = profile.id
							newUser.twitter.displayName = profile.displayName
							newUser.twitter.username = profile.username
							newUser.twitter.token = token
							if(_.isArray(profile.photos) && profile.photos.length > 0){
								newUser.twitter.photo = profile.photos[0].value
							}

							newUser.save(function(err){
								if(err) {
									return done(err);
								} else {
									return done(null, newUser);
								}
							})
						}
					}
				)

			} else {
				// user already exists and is logged in, we have to link accounts
				let user = req.user
				user.twitter.id = profile.id
				user.twitter.displayName = profile.displayName
				user.twitter.username = profile.username
				user.twitter.token = token
				if(_.isArray(profile.photos) && profile.photos.length > 0){
					user.twitter.photo = profile.photos[0].value
				}

				console.log('user already exists and is logged in, we have to link accounts. Saving:', user);

				let err = user.validateSync();
				if(err) {
					console.log('User is not valid', user, err);
				} else {
					
					user.save(function(err){
						if(err) {
							return done(err)
						} else {
							return done(null, user)
						}
					})

				}
				
			}

		})
	}))

	// ================================================================
	//	Routes
	// ================================================================

	let router = express.Router({mergeParams: true});

	// ================================================================
	//	Routes: Authentication
	// ================================================================

	router.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

  // handle the callback after twitter has authenticated the user
  router.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
      successRedirect : '/',
      failureRedirect : '/'
    }));

	// ================================================================
	//	Routes: Authorization
	// ================================================================

	// send to twitter to do the authentication
  router.get('/connect/twitter', passport.authorize('twitter'));

  // handle the callback after twitter has authorized the user
  router.get('/connect/twitter/callback',
      passport.authorize('twitter', {
          successRedirect : '/',
          failureRedirect : '/'
      }));

  // ================================================================
	//	Routes: Unlink accounts
	// ================================================================

  router.get('/unlink/twitter', function(req, res) {
        var user = req.user;
        user.twitter.token = undefined;
        user.save(function(err) {
          res.redirect('/');
        });
    });

	return router;
}