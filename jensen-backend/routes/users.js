const express = require('express');
const app = express();
const bp = require('body-parser')
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
router.use(express.json());
router.use(bp.json());
router.use(bp.urlencoded({ extended: true }))
const jwt = require ('jsonwebtoken');

const User = require('../model/User');
const logger = require('../config/logger');
const { forwardAuthenticated } = require('../config/auth');


// Login Page
 router.get('/login',(req, res) => res.render('welcome'));

// Register Page
router.get('/register',(req, res) => res.render('register'));

// Register
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  let errors = [];

  if (!name || !email || !password) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            const token = jwt.sign({_id: newUser._id}, process.env.JWT_KEY);
            newUser.token = token;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.render('welcome');
              })
              .catch(err => console.log(err));
      
          });
        });
      }
    });
  }
});
// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/inne',
    failureFlash: true
  })(req, res, next);
  logger.log({
    level: 'info',
    message:''
  });


});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.render('welcome');
});

module.exports = router;

