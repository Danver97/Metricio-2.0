const EventBus = require('../listeners/eventBus');
const Dashboard = require('../models/dashboard');

// Dashboard wrapper methods
// rst
function createDash(dashboardObj, cb) {
  const dashboard = new Dashboard(dashboardObj);
  if (cb) {
    Dashboard.createDash(dashboard, (err) => {
      if (!err) EventBus.emit('createDash', dashboard);
      cb(err, dashboard);
    });
    return null;
  }
  return new Promise(async (resolve, reject) => {
    try {
      await Dashboard.createDash(dashboard);
      EventBus.emit('createDash', dashboard);
      resolve(dashboard);
    } catch (e) {
      reject(e);
    }
  });
}

function updateDash(dashboardObj, cb) {
  const dashboard = dashboardObj._id ? dashboardObj : new Dashboard(dashboardObj);
  if (cb) {
    Dashboard.updateDash(dashboard, (err, doc) => {
      if (!err) EventBus.emit('updateDash', doc);
      cb(err, doc);
    });
    return null;
  }
  return new Promise(async (resolve, reject) => {
    try {
      const doc = await Dashboard.updateDash(dashboard);
      EventBus.emit('updateDash', doc);
      resolve(doc);
    } catch (e) {
      reject(e);
    }
  });
}

function deleteById(id, cb) {
  if (cb) {
    Dashboard.deleteById(id, (err, doc) => {
      if (!err) EventBus.emit('deleteDash', doc);
      cb(err, doc);
    });
    return null;
  }
  return new Promise(async (resolve, reject) => {
    try {
      const doc = await Dashboard.deleteById(id);
      EventBus.emit('deleteDash', doc);
      resolve(doc);
    } catch (e) {
      reject(e);
    }
  });
}

function deleteMultiple(idArr, cb) {
  if (cb) {
    Dashboard.deleteMultiple(idArr, (err, doc) => {
      if (!err) EventBus.emit('deleteDash', doc);
      cb(err, doc);
    });
    return null;
  }
  return new Promise(async (resolve, reject) => {
    try {
      const doc = await Dashboard.deleteMultiple(idArr);
      EventBus.emit('deleteDash', doc);
      resolve(doc);
    } catch (e) {
      reject(e);
    }
  });
}

function deleteByName(user, dashboardName, cb) {
  if (cb) {
    Dashboard.deleteByName(user, dashboardName, (err, doc) => {
      if (!err) EventBus.emit('deleteDash', doc);
      cb(err, doc);
    });
    return null;
  }
  return new Promise(async (resolve, reject) => {
    try {
      const doc = await Dashboard.deleteByName(user, dashboardName);
      EventBus.emit('deleteDash', doc);
      resolve(doc);
    } catch (e) {
      reject(e);
    }
  });
}

function findById(id, cb) {
  return Dashboard.findUsingId(id, cb);
}

function findByUser(user, cb) {
  return Dashboard.findByUser(user, cb);
}

function findByUserAndDashboardName(user, dashboardName, populate, cb) {
  return Dashboard.findByUserAndDashboardName(user, dashboardName, populate, cb);
}

// @deprecated
function findByUserAndDashboardNames(user, dashboardNames, projection, cb) {
  return Dashboard.findByUserAndDashboardNames(user, dashboardNames, projection, cb);
}

function startJob(jobObj, vars) {
  /* const JobStruct = jobStructures[jobObj.type];
  const job = JobStruct.fromObject(jobObj, vars); */
  if (Object.keys(vars).length !== 0)
    EventBus.emit('startParametrizedJob', jobObj, vars);
}

function stopJob(jobObj) {
  EventBus.emit('stopParametrizedJob', jobObj);
}
// rcl

EventBus.on('createJob', (job) => {
  setImmediate(async () => {
    const dashboard = await Dashboard.findByUserAndDashboardName(job.user, job.dashboard, false);
    dashboard.jobs.push(job._id);
    updateDash(dashboard);
  });
});

EventBus.on('deleteJob', (job) => {
  setImmediate(async () => {
    const dashboard = await Dashboard.findByUserAndDashboardName(job.user, job.dashboard, false);
    dashboard.jobs = dashboard.jobs.filter(j => j.toString() !== job._id.toString());
    updateDash(dashboard);
  });
});

EventBus.on('deleteDashsuite', (dashsuite) => {
  setImmediate(async () => {
    const dashboardsIds = dashsuite.dashboards;
    const promises = dashboardsIds.map(id => deleteById(id));
    Promise.all(promises);
  });
});

module.exports = {
  createDash,
  updateDash,
  deleteById,
  deleteByName,
  findById,
  findByUser,
  findByUserAndDashboardName,
  findByUserAndDashboardNames,
  startJob,
  stopJob,
};
