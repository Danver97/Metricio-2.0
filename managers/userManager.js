import logger from '../lib/logger';

const User = require('../models/user');
const EventBus = require('../listeners/eventBus');
const Events = require('../listeners/events');

// User wrapper methods
// rst
function createUser(userObj, cb) {
  const user = new User(userObj);
  if (cb) {
    User.createUser(user, (err, doc) => {
      if (!err) EventBus.emit(Events.createUser, user);
      cb(err, doc);
    });
    return null;
  }
  return new Promise((resolve, reject) => {
    User.createUser(user, (err, doc) => {
      if (err) reject(err);
      resolve(doc);
      EventBus.emit(Events.createUser, user);
    });
  });
}

function getByName(name, cb) {
  return User.getByName(name, cb);
}

function getById(id, cb) {
  return User.getById(id, cb);
}

function listById(idArr, cb) {
  return User.listById(idArr, cb);
}

function getAll(cb) {
  return User.getAll(cb);
}

function deleteByName(name, cb) {
  if (cb) {
    User.deleteByName(name, (err, doc) => {
      if (!err) EventBus.emit(Events.deleteUser, doc);
      cb(err, doc);
    });
    return null;
  }
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.deleteByName(name);
      EventBus.emit(Events.deleteUser, user);
      resolve(user);
    } catch (e) {
      reject(e);
    }
  });
}

function changePassword(id, name, password, cb) {
  if (cb) {
    if (name) {
      getByName(name, (err, user) => {
        if (err) cb(err);
        User.changePassword(user, password, cb);
      });
    } else if (id) {
      getById(id, (err, user) => {
        if (err) cb(err);
        User.changePassword(user, password, cb);
      });
    } else {
      throw new Error('Required id or name. Missing both.');
    }
    return null;
  }
  return new Promise(async (resolve, reject) => {
    try {
      let user = null;
      if (name)
        user = await getByName(name);
      else if (id)
        user = await getById(id);
      else
        reject(new Error('Required id or name. Missing both.'));
      if (!user) reject(new Error('No user found!'));
      User.changePassword(user, password, (err, doc) => {
        if (err) reject(err);
        resolve(doc);
      });
    } catch (e) {
      reject(e);
    }
  });
}

function autenticate(name, password, cb) {
  if (cb) {
    User.getByName(name, (err, doc) => {
      if (err) cb(err);
      if (!doc) cb(new Error('No user found!'));
      User.comparePassword(password, doc.password, cb);
    });
    return null;
  }
  return new Promise(async (resolve, reject) => {
    try {
      console.log('autenticate');
      const user = await User.getByName(name);
      if (!user) reject(new Error('No user found!'));
      User.comparePassword(password, user.password, (err, isMatch) => {
        if (!isMatch) reject(new Error('Wrong user or password.'));
        resolve(user);
      });
    } catch (e) {
      reject(e);
    }
  });
}
// rcl

const admin = { name: 'admin', role: 'admin', password: 'admin' };
createUser(admin, (err) => {
  if (err)
    logger('users', '\'admin\' user already saved in db.');
});

module.exports = {
  autenticate,
  createUser,
  changePassword,
  deleteByName,
  getById,
  getByName,
  getAll,
  listById,
};
