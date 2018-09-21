import logger from '../lib/logger';

const EventBus = require('../listeners/eventBus');
const Dashboard = require('../models/dashboard');
const Events = require('../listeners/events');

// Dashboard wrapper methods
// rst
function createDash(dashboardObj, cb) {
  const dashboard = new Dashboard(dashboardObj);
  if (cb) {
    Dashboard.createDash(dashboard, (err) => {
      if (!err) EventBus.emit(Events.createDashboard, dashboard);
      cb(err, dashboard);
    });
    return null;
  }
  return new Promise(async (resolve, reject) => {
    try {
      await Dashboard.createDash(dashboard);
      EventBus.emit(Events.createDashboard, dashboard);
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
      if (!err) EventBus.emit(Events.updateDashboard, doc);
      cb(err, doc);
    });
    return null;
  }
  return new Promise(async (resolve, reject) => {
    try {
      const doc = await Dashboard.updateDash(dashboard);
      EventBus.emit(Events.updateDashboard, doc);
      resolve(doc);
    } catch (e) {
      reject(e);
    }
  });
}

function deleteById(id, cb) {
  if (cb) {
    Dashboard.deleteById(id, (err, doc) => {
      if (!err) EventBus.emit(Events.deleteDashboard, doc);
      cb(err, doc);
    });
    return null;
  }
  return new Promise(async (resolve, reject) => {
    try {
      const doc = await Dashboard.deleteById(id);
      EventBus.emit(Events.deleteDashboard, doc);
      resolve(doc);
    } catch (e) {
      reject(e);
    }
  });
}

function deleteMultiple(idArr, cb) {
  if (cb) {
    Dashboard.deleteMultiple(idArr, (err, doc) => {
      if (!err) EventBus.emit(Events.deleteDashboard, doc);
      cb(err, doc);
    });
    return null;
  }
  return new Promise(async (resolve, reject) => {
    try {
      const doc = await Dashboard.deleteMultiple(idArr);
      EventBus.emit(Events.deleteDashboard, doc);
      resolve(doc);
    } catch (e) {
      reject(e);
    }
  });
}

function deleteByName(user, dashboardName, cb) {
  if (cb) {
    Dashboard.deleteByName(user, dashboardName, (err, doc) => {
      if (!err) EventBus.emit(Events.deleteDashboard, doc);
      cb(err, doc);
    });
    return null;
  }
  return new Promise(async (resolve, reject) => {
    try {
      const doc = await Dashboard.deleteByName(user, dashboardName);
      EventBus.emit(Events.deleteDashboard, doc);
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
    EventBus.emit(Events.startParametrizedJob, jobObj, vars);
}

function stopJob(jobObj) {
  EventBus.emit(Events.stopParametrizedJob, jobObj);
}
// rcl

// Subscribe to EventBus events
EventBus.on(Events.createJob, (job) => {
  setImmediate(async () => {
    const dashboard = await Dashboard.findByUserAndDashboardName(job.user, job.dashboard, false);
    dashboard.jobs.push(job._id);
    updateDash(dashboard);
  });
});

EventBus.on(Events.deleteJob, (job) => {
  setImmediate(async () => {
    const dashboard = await Dashboard.findByUserAndDashboardName(job.user, job.dashboard, false);
    dashboard.jobs = dashboard.jobs.filter(j => j.toString() !== job._id.toString());
    updateDash(dashboard);
  });
});

EventBus.on(Events.deleteDashsuite, (dashsuite) => {
  setImmediate(async () => {
    const dashboardsIds = dashsuite.dashboards;
    const promises = dashboardsIds.map(id => deleteById(id));
    Promise.all(promises);
  });
});

EventBus.on(Events.createDashsuite, (dashsuite) => {
  setImmediate(async () => {
    if (dashsuite.name.toString() === 'Admin Dashsuite') {
      try {
        await createDash({
          name: 'Admin Dashboard',
          dashsuite: dashsuite._id,
          user: dashsuite.user,
          children: [
            {
              type: 'SparklineWidget',
              attrs: {
                id: 'a',
                jobName: 'demos',
                name: 'DemoUsers',
                title: 'Users',
                format: '0.00a',
                layout: {
                  x: 0,
                  y: 0,
                  w: 4,
                  h: 5,
                  minH: 5,
                  maxH: 7,
                  minW: 2,
                  maxW: 4,
                  static: false,
                  isDraggable: true,
                  isResizable: true,
                },
                key: 'a',
              },
            },
            {
              type: 'PingWidget',
              attrs: {
                id: 'b',
                key: 'b',
                jobName: 'ping-example',
                name: 'GooglePing',
                title: 'API',
                layout: {
                  x: 0,
                  y: 0,
                  w: 4,
                  h: 5,
                  minH: 5,
                  maxH: 7,
                  minW: 2,
                  maxW: 4,
                  static: false,
                  isDraggable: true,
                  isResizable: true,
                },
              },
            },
            {
              type: 'BuildStatusWidget',
              attrs: {
                id: 'c',
                key: 'c',
                jobName: 'demos',
                name: 'DemoMaster',
                title: 'Build - Master',
                layout: {
                  x: 0,
                  y: 0,
                  w: 4,
                  h: 5,
                  minH: 5,
                  maxH: 7,
                  minW: 2,
                  maxW: 4,
                  static: false,
                  isDraggable: true,
                  isResizable: false,
                },
              },
            },
            {
              type: 'ProgressWidget',
              attrs: {
                id: 'd',
                key: 'd',
                jobName: 'demos',
                name: 'DemoProgress',
                title: 'Sales Target',
                layout: {
                  x: 0,
                  y: 0,
                  w: 4,
                  h: 5,
                  minH: 5,
                  maxH: 5,
                  minW: 2,
                  maxW: 4,
                  static: false,
                  isDraggable: true,
                  isResizable: true,
                },
              },
            },
            {
              type: 'NumberWidget',
              attrs: {
                id: 'e',
                key: 'e',
                jobName: 'demos',
                name: 'DemoConversion',
                title: 'Conversion',
                metric: '%',
                format: '0.0a',
                layout: {
                  x: 0,
                  y: 0,
                  w: 4,
                  h: 5,
                  minH: 5,
                  maxH: 5,
                  minW: 2,
                  maxW: 4,
                  static: false,
                  isDraggable: true,
                  isResizable: true,
                },
              },
            },
            {
              type: 'BuildStatusWidget',
              attrs: {
                id: 'f',
                key: 'f',
                jobName: 'demos',
                name: 'DemoDevelop',
                title: 'Build - Develop',
                layout: {
                  x: 0,
                  y: 0,
                  w: 4,
                  h: 5,
                  minH: 5,
                  maxH: 7,
                  minW: 2,
                  maxW: 4,
                  static: false,
                  isDraggable: true,
                  isResizable: false,
                },
              },
            },
            {
              type: 'GraphWidget',
              attrs: {
                id: 1533129232825,
                key: '1533129232825',
                jobName: 'demos',
                name: 'DemoHistogram',
                title: 'GraphWidget',
                layout: {
                  x: 0,
                  y: 0,
                  w: 4,
                  h: 10,
                  minH: 10,
                  maxH: 12,
                  minW: 2,
                  maxW: 12,
                  static: false,
                  isDraggable: true,
                  isResizable: true,
                },
              },
            },
            {
              type: 'MultipleProgressWidget',
              attrs: {
                id: 1536831004307,
                key: '1536831004307',
                jobName: 'demos',
                name: 'DemoMultiProgress',
                title: 'Multi Progress',
                format: '0.0a',
                layout: {
                  x: 0,
                  y: 0,
                  w: 4,
                  minH: 5,
                  maxH: 5,
                  minW: 2,
                  maxW: 4,
                  static: false,
                  isDraggable: true,
                  isResizable: true,
                },
              },
            },
          ],
          layouts: [
            {
              w: 4,
              h: 5,
              x: 8,
              y: 0,
              i: 'a',
              minW: 2,
              maxW: 4,
              minH: 5,
              maxH: 7,
              moved: false,
              static: false,
              isDraggable: true,
              isResizable: true,
            },
            {
              w: 4,
              h: 5,
              x: 8,
              y: 10,
              i: 'b',
              minW: 3,
              maxW: 4,
              minH: 5,
              maxH: 7,
              moved: false,
              static: false,
              isDraggable: true,
              isResizable: true,
            },
            {
              w: 4,
              h: 5,
              x: 4,
              y: 0,
              i: 'c',
              minW: 2,
              maxW: 4,
              minH: 5,
              maxH: 7,
              moved: false,
              static: false,
              isDraggable: true,
              isResizable: false,
            },
            {
              w: 4,
              h: 5,
              x: 4,
              y: 10,
              i: 'd',
              minW: 2,
              maxW: 4,
              minH: 5,
              maxH: 5,
              moved: false,
              static: false,
            },
            {
              w: 4,
              h: 5,
              x: 8,
              y: 5,
              i: 'e',
              minW: 2,
              maxW: 4,
              minH: 5,
              maxH: 7,
              moved: false,
              static: false,
              isDraggable: true,
              isResizable: true,
            },
            {
              w: 4,
              h: 5,
              x: 4,
              y: 5,
              i: 'f',
              minW: 2,
              maxW: 4,
              minH: 5,
              maxH: 7,
              moved: false,
              static: false,
              isDraggable: true,
              isResizable: false,
            },
            {
              w: 4,
              h: 10,
              x: 0,
              y: 0,
              i: '1533129232825',
              minW: 2,
              maxW: 12,
              minH: 10,
              maxH: 12,
              moved: false,
              static: false,
              isDraggable: true,
              isResizable: true,
            },
            {
              w: 4,
              h: 8,
              x: 0,
              y: 10,
              i: '1536831004307',
              minW: 2,
              maxW: 12,
              minH: 5,
              maxH: 100,
              moved: false,
              static: false,
              isDraggable: true,
              isResizable: true,
            },
          ],
        });
      } catch (e) {
        logger('dashboards', '\'Admin Dashboard\' dashboard already saved in db.');
      }
      // console.log('done');
    }
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
