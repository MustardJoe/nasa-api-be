const { Router } = require('express');
const User = require('../models/User');
//will need the other imports here after I've written them

module.exports = Router()
  .post('/signup', (req, res, next) => {
    const {
      email,
      password
    } = req.body;

    User
      .creat({ email, password })
      .then(user => {
        const token = user.authToken();

        res.cookie('session', token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60
        });
        res.send(user);
      })
      .catch(next);
  })

  .post('/signin', (req, res, next) => {
    const {
      email, 
      password
    } = req.body;

    User
      .findOne({ email })
      .then(user => {
        const isValidPassword = user.compare(password);
        if(isValidPassword) {
          const token = user.authToken();
          res.cookie('session', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60
          });
          res.send(user);
        } else {
          const err = new Error('Invalid email/password');
          err.status = 401;
          next(err);
        }
      });
  })

  .get('/verify-user', ensureAuth, (req, res) => {
    res.send(req.user);
  });
  
