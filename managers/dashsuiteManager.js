import logger from '../lib/logger';

const EventBus = require('../listeners/eventBus');
const Dashsuite = require('../models/dashsuite');
const Events = require('../listeners/events');

// Dashsuite wrapper methods
// rst
function createDash(dashsuiteObj, cb) {
  const dashsuite = new Dashsuite(dashsuiteObj);
  if (cb) {
    Dashsuite.createDash(dashsuite, (err, doc) => {
      if (!err) EventBus.emit(Events.createDashsuite, doc);
      cb(err, doc);
    });
    return null;
  }
  return new Promise(async (resolve, reject) => {
    try {
      const doc = await Dashsuite.createDash(dashsuite);
      EventBus.emit(Events.createDashsuite, doc);
      resolve(doc);
    } catch (e) {
      reject(e);
    }
  });
}

function updateDash(dashsuiteObj, cb) {
  const dashsuite = dashsuiteObj._id ? dashsuiteObj : new Dashsuite(dashsuiteObj);
  if (cb) {
    Dashsuite.updateDash(dashsuite, (err, doc) => {
      if (!err) EventBus.emit(Events.updateDashsuite, doc);
      cb(err, doc);
    });
    return null;
  }
  return new Promise(async (resolve, reject) => {
    try {
      const doc = await Dashsuite.updateDash(dashsuite);
      EventBus.emit(Events.updateDashsuite, doc);
      resolve(doc);
    } catch (e) {
      reject(e);
    }
  });
}

function deleteDash(user, dashsuiteName, cb) {
  if (cb) {
    Dashsuite.deleteDash(user, dashsuiteName, (err, doc) => {
      if (!err) EventBus.emit(Events.deleteDashsuite, doc);
      cb(err, doc);
    });
    return null;
  }
  return new Promise(async (resolve, reject) => {
    try {
      const doc = await Dashsuite.deleteDash(user, dashsuiteName);
      EventBus.emit(Events.deleteDashsuite, doc);
      resolve(doc);
    } catch (e) {
      reject(e);
    }
  });
}

function findById(id, cb) {
  return Dashsuite.findUsingId(id, cb);
}

function findByUser(user, cb) {
  return Dashsuite.findByUser(user, cb);
}

function findByUserAndDashSuiteName(user, dashSuiteName, populate, cb) {
  return Dashsuite.findByUserAndDashSuiteName(user, dashSuiteName, populate, cb);
}
// rcl

// Subscribe to EventBus events
EventBus.on(Events.deleteDashboard, (dashboard) => {
  setImmediate(async () => {
    const dashsuite = await findById(dashboard.dashsuite);
    dashsuite.dashboards = dashsuite.dashboards.filter(id => id !== dashboard._id);
    updateDash(dashsuite);
  });
});

EventBus.on(Events.createDashboard, (dashboard) => {
  setImmediate(async () => {
    const dashsuite = await findById(dashboard.dashsuite);
    dashsuite.dashboards.push(dashboard._id);
    updateDash(dashsuite);
  });
});

EventBus.on(Events.createUser, (user) => {
  setImmediate(async () => {
    if (user.name.toString() === 'admin') {
      try {
        await createDash({
          user: user._id,
          name: 'Admin Dashsuite',
        });
      } catch (e) {
        logger('dashsuites', '\'Admin Dashsuite\' dashsuite already saved in db.');
      }
      // console.log('dashsuite');
    }
  });
});

module.exports = {
  createDash,
  updateDash,
  deleteDash,
  findById,
  findByUser,
  findByUserAndDashSuiteName,
};
