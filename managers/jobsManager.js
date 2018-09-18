const Job = require('../models/job');
const EventBus = require('../listeners/eventBus');

// Job wrapper methods
// rst
function createJob(jobObj, cb) {
  const job = new Job(jobObj);
  if (cb) {
    Job.createJob(job, (err) => {
      if (!err) EventBus.emit('createJob', job);
      cb(err, job);
    });
    return null;
  }
  return new Promise(async (resolve, reject) => {
    try {
      await Job.createJob(job);
      EventBus.emit('createJob', job);
    } catch (e) {
      reject(e);
    }
  });
}

function findByUser(user, cb) {
  if (cb) {
    Job.findByUser(user, cb);
    return null;
  }
  return Job.findByUser(user);
}

function findByUserAndDashboard(user, dashboard, cb) {
  if (cb) {
    Job.findByUserAndDashboard(user, dashboard, cb);
    return null;
  }
  return Job.findByUserAndDashboard(user, dashboard);
}

function findByUserAndJobName(user, jobName, cb) {
  if (cb) {
    Job.findByUserAndJobName(user, jobName, cb);
    return null;
  }
  return Job.findByUserAndJobName(user, jobName);
}

function getJobNamesLike(user, namelike, cb) {
  if (cb) {
    Job.getJobNamesLike(user, namelike, cb);
    return null;
  }
  return Job.getJobNamesLike(user, namelike);
}

function getTaskNamesLike(user, jobName, like, cb) {
  if (cb) {
    Job.getTaskNamesLike(user, jobName, like, cb);
    return null;
  }
  return Job.getTaskNamesLike(user, jobName, like);
}

function getAll(cb) {
  if (cb) {
    Job.getAll(cb);
    return null;
  }
  return Job.getAll();
}

function deleteJobById(jobId, cb) {
  if (cb) {
    Job.deleteJobById(jobId, (err, doc) => {
      EventBus.emit('deleteJob', doc.jobName);
      if (cb)
        cb(err, doc);
    });
    return null;
  }
  return new Promise(async (resolve, reject) => {
    try {
      const doc = await Job.deleteJobById(jobId);
      EventBus.emit('deleteJob', doc.jobName);
      resolve(doc);
    } catch (e) {
      reject(e);
    }
  });
}

function deleteJob(user, jobName, cb) {
  if (cb) {
    Job.deleteJob(user, jobName, (err, doc) => {
      EventBus.emit('deleteJob', doc);
      if (cb)
        cb(err, doc);
    });
    return null;
  }
  return new Promise(async (resolve, reject) => {
    try {
      const doc = await Job.deleteJob(user, jobName);
      EventBus.emit('deleteJob', doc);
      resolve(doc);
    } catch (e) {
      reject(e);
    }
  });
}

function updateJob(user, jobName, jobObj, cb) {
  const job = new Job(jobObj);
  if (cb) {
    Job.updateJob(user, jobName, job, (err, doc) => {
      EventBus.emit('updateJob', doc);
      if (cb)
        cb(err, doc);
    });
    return null;
  }
  return new Promise(async (resolve, reject) => {
    try {
      const doc = await Job.updateJob(user, jobName, job);
      EventBus.emit('updateJob', doc);
      resolve(doc);
    } catch (e) {
      reject(e);
    }
  });
}
// rcl

EventBus.on('deleteDash', (dashboard) => {
  setImmediate(async () => {
    const jobsIds = dashboard.jobs;
    const promises = jobsIds.map(id => deleteJobById(id.toString()));
    Promise.all(promises);
  });
});

module.exports = {
  createJob,
  findByUser,
  findByUserAndDashboard,
  findByUserAndJobName,
  getJobNamesLike,
  getTaskNamesLike,
  getAll,
  deleteJobById,
  deleteJob,
  updateJob,
};
