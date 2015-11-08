import jwt from 'jsonwebtoken'
import { API_TOKEN_SECRET } from '../../../authConfig'
import _ from 'lodash'

function requireApiToken(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.apiToken || req.query.apiToken || req.headers['x-access-token'];
  console.log('token', token);

  if (token) {
    // Decode and verify token
    jwt.verify(token, API_TOKEN_SECRET, function(err, decodedUser) {
      console.log('decodedUser', decodedUser);
      if (err) {
        return res.status(500).send({message: 'Failed to process token'});
        //return next(err);
      } else {
        // if everything is good, save to request for use in other routes
        req.user = decodedUser;
        next();
      }
    });
  } else {
    return res.status(403).send({message: 'API token required'});
  }
}

export { 
  requireApiToken
}