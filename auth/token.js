var config = require('../config');
var jwt = require('jsonwebtoken');

function validateToken(req, res, next) {

    console.log('validating token');

    
    // check header or url parameters or post parameters for token
    var token = req.headers['authorization'];
    console.log(token);
    if (!token) 
      return res.status(403).send({ auth: false, message: 'No token provided.' });
  
    // verifies secret and checks exp
    
    var Bearer = token.split(" ");
    console.log(Bearer[1]);
    jwt.verify(Bearer[1], config.secret, function(err, decoded) { 
      if (err) 
        return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });    
  
      // if everything is good, save to request for use in other routes
      req.userId = decoded.id;
      next();
    });
  
  }

  function createToken(id) {

    var token = jwt.sign({ id: id }, config.secret, {
        expiresIn: config['user-token-expiry-duration'] // expires in 24 hours
      });
    return token;
  
  }


  function validateApiSecurity(req, res, next) {
    console.log('validating Api Security');

    var apiKey = req.headers['x-api-key'];

    var isValid = (config['api-key']==apiKey) ? true:false;

    if (!isValid) 
      return res.status(403).send({ auth: false, message: 'Not Authenticated to call this service, .' });
  

    next();
  
  }

  module.exports = {
    createToken,validateToken,validateApiSecurity
};
