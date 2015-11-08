import express from 'express';
import _ from 'lodash';
import { User, Story } from '../../../models';

let router = express.Router({mergeParams: true});

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
                var token = user.generateApiToken();
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

export { router as signup }