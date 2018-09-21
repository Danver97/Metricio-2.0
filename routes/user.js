import { getUserFromRequest } from '../lib/utils';

const express = require('express');
const jwt = require('jsonwebtoken');

const userMgr = require('../managers/userManager');
const ENV = require('../config/env');

const responses = require('../lib/responses');

const router = express.Router();

router.get('/list', getUserFromRequest, async (req, res) => {
  try {
    const users = await userMgr.getAll();
    res.status(200);
    res.json(users);
  } catch (e) {
    responses.internalServerError(res, e.message);
  }
});

router.post('/login', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    const user = await userMgr.autenticate(username, password);
    delete user.password;
    const age = process.env.NODE_ENV === 'production' ? 1200000 : 1200000000;
    const expiration = (new Date(Date.now() + age));
    const token = jwt.sign({ user, exp: expiration.getTime() / 1000 }, ENV.jwtSecret);
    res.header('Autorization', `Bearer ${token}`);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.cookie('access_token', token, { expires: expiration, path: '/' }); // , domain: 'localhost'
    res.cookie('user', JSON.stringify(user), { expires: expiration, path: '/' });
    console.log('Authentication: success.');
    res.status(200);
    res.json({ token });
  } catch (e) {
    console.log('Authentication: failed.');
    responses.badRequest(res, e.message);
  }
});

router.post('/create', getUserFromRequest, async (req, res) => {
  if (req.user.role !== 'admin') {
    res.status(403);
    res.json({ error: 'Your role doesn\'t have this authorization.' });
  }
  try {
    await userMgr.createUser({
      name: req.body.name,
      role: req.body.role,
      password: req.body.password,
    });
    res.status(200);
    res.end();
  } catch (e) {
    responses.internalServerError(res, e.message);
  }
});

router.post('/changePassword', getUserFromRequest, async (req, res) => {
  const id = req.user.id;
  const name = req.user.name;
  const newPassword = req.body.password;
  if (!newPassword || (!id && !name)) {
    responses.badRequest(res, 'Missing body params.');
  }
  try {
    await userMgr.changePassword(id, name, newPassword);
    res.status(200);
    res.end();
  } catch (e) {
    responses.internalServerError(res, e.message);
  }
});

module.exports = router;
