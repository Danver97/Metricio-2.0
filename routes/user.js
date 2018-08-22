const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');
const ENV = require('../config/env');
import { ifLoggedNotLog, ensureAndVerifyToken } from '../lib/utils';

const router = express.Router();

/*passport.use(new LocalStrategy((username, password, done) => {
    User.getByName(username, (err, user) => {
      if (err) throw err;
      if (!user) {
        return done(null, false, {
          message: 'Unknown User'
        });
      }
      User.comparePassword(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, {
            message: 'Invalid password'
          });
        }
      });
    });
  }));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.getById(id, (err, user) => {
    done(err, user);
  });
});*/

passport.use(new BearerStrategy((token, cb) => {
  const decoded = jwt.verify(token, ENV.jwtSecret);
  console.log(decoded);
  User.getByName(decoded.user.name, (err, doc) => {
    console.log(doc);
    if(err)
      return cb(err);
    if(!doc)
      return cb(null, false);
    return cb(null, doc);
  });
}));

router.get('/', (req, res) => {
  res.render('index', {
    name: 'users',
  });
});

router.get('/login', ifLoggedNotLog, (req, res) => {
  res.render('index', {
    name: 'login',
  });
});

router.post('/login',
  //passport.authenticate('local', {failureRedirect: '/users/login'}),
  //passport.authenticate('bearer', {session: false}),
  (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log(req.headers);
    User.getByName(username, (err, doc) => {
      if (err) throw err;
      try {
        if(!doc) throw new Error('No user found');
        User.comparePassword(password, doc.password, (err, isMatch) => {
          if(isMatch) {
            delete doc.password;
            const expiration = (new Date(Date.now()+ 20*60*1000));
            const token = jwt.sign({ user: doc, exp: expiration.getTime()/1000 }, ENV.jwtSecret);
            res.header('Autorization', 'Bearer ' + token);
            res.header('Set-Cookie', 'access_token=' + token + '; Expires=' + expiration.toString() + '; Domain=localhost; Path=/');
            res.status(200);
            res.json({token: token});
          } else {
            res.status(400);
            res.json({error: 'Wrong username or password'});
          }
        });
      } catch(e) {
        res.status(400);
        res.json({error: 'Wrong username or password'});
      }
      //res.redirect('/');
    });
  });

router.get('/list', ensureAndVerifyToken, (req, res) => {
  res.json([{
    name: 'Carlos',
    role: 'Moderator',
  }, {
    name: 'Niko',
    role: 'User',
  }]);
});

router.get('/create', (req, res) => {
  res.end('/create');
});

router.post('/create', (req, res) => {
  const user = new User({
    name: req.body.name,
    role: req.body.role,
    password: req.body.password,
  });
  User.create(user, (err, doc) => {
    if (err) throw err;
    //console.log(doc);
  });
  res.redirect('/users/list');
});

router.post('/changePassword', ensureAndVerifyToken, (req, res) => {
  const id = req.decodedToken.user._id;
  const name = req.decodedToken.user.name;
  const newPassword = req.body.password;
  if(!newPassword || (!id && !name)){
    res.statusCode = 500;
    res.end();
  }
  if(id)
    User.getById(id, (err, user) => {
      User.changePassword(user, newPassword, (err, user) => {
        if(err) throw err;
      });
    });
  else if(name){
    User.getByName(name, (err, user) => {
      User.changePassword(user, newPassword, (err, user) => {
        if(err) throw err;
      });
    });
  }
  res.end();
});



module.exports = router;
