var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var User = require('./authModel');
const bcrypt = require('bcrypt');
var config = require('../config');
var token = require('./token')
const saltRounds = 10;

router.post('/signup', function (req, res) {
    console.log('reacehd');
    
    var hash = bcrypt.hashSync(req.body.password, saltRounds);

    User.create({
            name : req.body.name,
            email : req.body.email,
            password : hash
        }, 
        function (err, user) {
            if (err) return res.status(500).send("There was a problem registering the user`.");
    
            var token1 = token.createToken(user._id);
        
            res.status(200).send({ auth: true, token: token1 });
          });
});

router.post('/signin', function(req, res) {

    User.findOne({ email: req.body.email }, function (err, user) {
      console.log(user);
      if (err) return res.status(500).send('Error on the server.');
      if (!user) return res.status(404).send('No user found.');
      var hash = bcrypt.hashSync(req.body.password, saltRounds);

      console.log(hash);
      console.log(user.password);
      
      
      // check if the password is valid
      var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
      console.log(passwordIsValid);
      if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
  
      // if user is found and password is valid
      // create a token
      var token1 = token.createToken(user._id);
  
      // return the information including token as JSON
      res.status(200).send({ auth: true, token: token1 });
    });
  
  });
  router.get('/validate', token.validateToken, function(req, res, next) {

    console.log('validating happening');


    User.findById(req.userId, function (err, user) {
      if (err) return res.status(500).send("There was a problem finding the user.");
      if (!user) return res.status(404).send("No user found.");
      res.status(200).send({"auth":"true"});
    });
  
  });




module.exports = router;