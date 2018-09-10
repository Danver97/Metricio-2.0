import { getUserFromRequest } from '../lib/utils';

const express = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const ENV = require('../config/env');

const responses = require('../lib/responses');

const router = express.Router();

router.get('/list', getUserFromRequest, async (req, res) => {
  try {
    const users = await User.getAll();
    res.status(200);
    res.json(users);
  } catch (e) {
    responses.internalServerError(res, e.message);
  }
});

router.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  User.getByName(username, (err, doc) => {
    if (err) throw err;
    console.log(doc);
    try {
      if (!doc) throw new Error('No user found');
      User.comparePassword(password, doc.password, (isMatch) => {
        if (isMatch) {
          delete doc.password;
          const age = process.env.NODE_ENV === 'production' ? 1200000 : 1200000000;
          const expiration = (new Date(Date.now() + age));
          const token = jwt.sign({ user: doc, exp: expiration.getTime() / 1000 }, ENV.jwtSecret);
          res.header('Autorization', `Bearer ${token}`);
          // res.header('Set-Cookie', `access_token=${token}; Expires=${expiration.toString()}; Domain=localhost; Path=/;`);
          res.cookie('access_token', token, { expires: expiration, domain: 'localhost', path: '/' });
          res.cookie('user', JSON.stringify(doc), { expires: expiration, domain: 'localhost', path: '/' });
          console.log('success');
          res.status(200);
          res.json({ token });
        } else {
          console.log('Wrong username or password');
          responses.badRequest(res, 'Wrong username or password');
        }
      });
    } catch (e) {
      console.log('Wrong username or password');
      responses.badRequest(res, 'Wrong username or password');
    }
    // res.redirect('/');
  });
});

router.post('/create', getUserFromRequest, (req, res) => {
  const user = new User({
    name: req.body.name,
    role: req.body.role,
    password: req.body.password,
  });
  User.createUser(user, (err) => {
    if (err) throw err;
    res.redirect('/users/list');
  });
});

router.post('/changePassword', getUserFromRequest, (req, res) => {
  const id = req.user.id;
  const name = req.user.name;
  const newPassword = req.body.password;
  if (!newPassword || (!id && !name)) {
    res.statusCode = 500;
    res.end();
  }
  if (id)
    User.getById(id, (err, user) => {
      User.changePassword(user, newPassword, (err, user) => {
        if (err) throw err;
      });
    });
  else if (name) {
    User.getByName(name, (err, user) => {
      User.changePassword(user, newPassword, (err, user) => {
        if (err) throw err;
      });
    });
  }
  res.end();
});

module.exports = router;
