const EventBus = require('../listeners/eventBus');
const Dashsuite = require('../models/dashsuite');

// Dashsuite wrapper methods
// rst
function createDash(dashsuiteObj, cb) {
  const dashsuite = new Dashsuite(dashsuiteObj);
  if (cb) {
    Dashsuite.createDash(dashsuite, (err, doc) => {
      if (!err) EventBus.emit('createDashsuite', doc);
      cb(err, doc);
    });
    return null;
  }
  return new Promise(async (resolve, reject) => {
    try {
      const doc = await Dashsuite.createDash(dashsuite);
      EventBus.emit('createDashsuite', doc);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}

function updateDash(dashsuiteObj, cb) {
  const dashsuite = dashsuiteObj._id ? dashsuiteObj : new Dashsuite(dashsuiteObj);
  if (cb) {
    Dashsuite.updateDash(dashsuite, (err, doc) => {
      if (!err) EventBus.emit('updateDashsuite', doc);
      cb(err, doc);
    });
    return null;
  }
  return new Promise(async (resolve, reject) => {
    try {
      const doc = await Dashsuite.updateDash(dashsuite);
      EventBus.emit('updateDashsuite', doc);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}

function deleteDash(user, dashsuiteName, cb) {
  if (cb) {
    Dashsuite.deleteDash(user, dashsuiteName, (err, doc) => {
      if (!err) EventBus.emit('deleteDashsuite', doc);
      cb(err, doc);
    });
    return null;
  }
  return new Promise(async (resolve, reject) => {
    try {
      const doc = await Dashsuite.deleteDash(user, dashsuiteName);
      EventBus.emit('deleteDashsuite', doc);
      resolve();
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

EventBus.on('deleteDash', (dashboard) => {
  setImmediate(async () => {
    const dashsuite = await findById(dashboard.dashsuite);
    dashsuite.dashboards = dashsuite.dashboards.filter(id => id !== dashboard._id);
    updateDash(dashsuite);
  });
});

EventBus.on('createDash', async (dashboard) => {
  setImmediate(async () => {
    const dashsuite = await findById(dashboard.dashsuite);
    dashsuite.dashboards.push(dashboard._id);
    updateDash(dashsuite);
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
