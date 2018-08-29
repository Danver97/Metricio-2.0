import moment from 'moment';
const jwt = require('jsonwebtoken');
const ENV = require('../config/env');

export function parseTime(ms) {
  const duration = moment.duration(ms);
  if (ms < 1000) return { unit: duration.asMilliseconds(), metric: 'ms' };
  if (ms >= 1000 && ms < 60000) return { unit: parseFloat(duration.asSeconds()).toFixed(2), metric: 's' };
  return { unit: parseFloat(duration.asMinutes()).toFixed(2), metric: 'm' };
}

export function parseStatusCode(status) {
  if (status !== 200) return 'down';
  return 'up';
}

export function ensureAutenticated(req, res, next) {
  return next();
  if (req.isAuthenticated())
    return next();
  res.redirect('/users/login');
  return null;
}

export function ifLoggedNotLog(req, res, next) {
  return next();
  if (req.isAuthenticated()) {
    res.redirect('/');
    return null;
  }
  return next();
}

export function ensureToken(req, res, next) {
  const header = req.headers['authorization'] || req.cookies['access_token'];
  if (header) {
    req.token = /Bearer/.test(header) ? header.split(' ')[1] : header;
    return next();
  }
  res.status(403);
  res.json({ error: 'No Authorization header found.' });
  return null;
}

export function verifyToken(req, res, next) {
  try {
    req.decodedToken = jwt.verify(req.token, ENV.jwtSecret);
    return next();
  } catch (e) {
    res.status(403);
    res.json({ error: 'Token not valid.' });
    return null;
  }
}

export function ensureAndVerifyToken(req, res, next) {
  const header = req.headers['authorization'] || req.cookies['access_token'];
  if (header) {
    req.token = /Bearer/.test(header) ? header.split(' ')[1] : header;
    // console.log('token: ' + req.token);
    try {
      req.decodedToken = jwt.verify(req.token, ENV.jwtSecret);
      return next();
    } catch (e) {
      res.status(403);
      res.json({ error: 'Token not valid.' });
      // throw e;
      return null;
    }
  } else {
    res.status(403);
    res.json({ error: 'No Authorization header found.' });
    return null;
  }
}

export function getUserFromDecodedToken(req, res, next) {
  req.user = Object.assign({}, req.decodedToken.user);
  req.user.id = req.decodedToken.user._id;
  delete req.user._id;
  next();
}

export function getUserFromRequest(req, res, next) {
  ensureToken(req, res, () => {
    verifyToken(req, res, () => {
      getUserFromDecodedToken(req, res, () => {
        next();
      });
    });
  });
}

export function getURLQueryFromObject(obj, filter) {
  let query = '';
  const filt = filter || [];
  let first = true;
  Object.keys(obj).forEach(k => {
    if (!filt.includes(k)) {
      if (first) {
        query = `${k}=${obj[k]}`;
        first = false;
      } else
        query = `${query}&${k}=${obj[k]}`;
    }
  });
  return query;
}

export function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
