import express from 'express';
import app from '../app/server';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import compression from 'compression';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import User from '../models/User';
import _ from 'lodash';
import ErrorCodes from '../app/shared/ErrorCodes';

const env = process.env;
const host = env.npm_package_config_appServerHost;
const port = env.npm_package_config_appServerPort;
const mongoConnection = env.npm_package_config_appMongoConnection;

let router = express();

mongoose.connect(mongoConnection);

app.set('apiTokenSecret', 'lE239(e_$V18_b3.dy2ZJX\lg156h');			// Used to generate strong JWT keys.
router.use(morgan('dev')); 																				// log every request to the console
router.use(compression());
router.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
router.use(bodyParser.json());                                     // parse application/json
router.use(methodOverride());
router.use(cookieParser('92ZJX\lE23g156h')); // secret value can be anything.

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

let mongoStore = MongoStore(session);
router.use(session({
	resave: true,
	saveUninitialized: true,
  secret: '5r(e_$V18_b3.dy', // secret can be anything.
  //maxAge: new Date(Date.now() + 3600000),
	store: new mongoStore({
		mongooseConnection: mongoose.connection
	})
}));
router.use(passport.initialize());
router.use(passport.session());

var sendJsonErrorCode = function(res, errCode, data){
	var json = {
		message: errCode.message, 
 		error_code: errCode.code
	};
	_.extend(json, {}, data);
	return res.status(errCode.status || 500).json(json);
};

router.get('/signout', function(req, res){
	req.logout();
	res.redirect('/');
});

router.get('/signup/username/:username', function(req, res){
	var username_lower = _.trim(req.params.username.toLowerCase());
	User
		.count({username_lower: username_lower}).limit(1)
		.exec(function(err, count){
			if(err) {
				next(err);
			} else {
				res.status(200).json({available: count === 0});
			}
		});
});

router.get('/signup/email/:email', function(req, res){
	var email = _.trim(req.params.email.toLowerCase());
	User
		.count({email: email}).limit(1)
		.exec(function(err, count){
			if(err) {
				next(err);
			} else {
				res.status(200).json({available: count === 0});
			}
		});
});

router.post('/signup', function(req, res, next) {
  var user = new User({
    username: req.body.username,
    username_lower: req.body.username && req.body.username.toLowerCase(),
    password: req.body.password,
    email: req.body.email
  });

  // Validate user properties.
  let err = user.validateSync();
	if(err){
		sendJsonErrorCode(res, ErrorCodes.invalid_user, {error: err.toString()});
 	} else {
 		// Check if username or email is taken.
 		let query = {$or: [{email: user.email.toLowerCase()}, {username_lower: user.username_lower }]};
 		User.find(query, function(err, users){
 			if(err){
 				return next(err);
 			} else if(users.length != 0){
 				if(users[0].username_lower === user.username_lower) {
 					sendJsonErrorCode(res, ErrorCodes.username_taken);
	 			} else {
	 				sendJsonErrorCode(res, ErrorCodes.email_taken);
	 			} 				
 			} else {
 				user.save(function(err) {
			    if (err) {
			    	return next(err);
			    } else {
			      req.login(user, function(err){
			        if (err) {
			        	return next(err);
			        } else {
			          var token = user.generateApiToken(app.get('apiTokenSecret'));
				        res.status(200).json({
				        	user: user,
				        	token: token
				        });
			        }
			      });
			    }
			  });
 			}
 		});
 	}
});

router.use('/*', app);

router.use(function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
  	console.log(err.stack);
    res.status(500).send({ error: 'Something blew up!' });
  } else {
    next(err);
  }
});

router.use(function errorHandler(err, req, res, next) {
	console.log(err.stack);
  res.status(500).send({ message: 'Server error', error: err });
});

let server = router.listen(port, host);

export default server;
