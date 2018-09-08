import logger from '../lib/logger';

const mongoose = require('mongoose');
const jobEvents = require('../listeners/jobListener');

const JobSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  jobName: {
    type: String,
    required: true,
  },
  interval: {
    type: String,
    required: true,
  },
  tasks: {
    type: [{
      taskName: {
        type: String,
      },
      type: {
        type: String,
      },
      task: {
        type: {},
      },
    }],
  },
});

JobSchema.index({ user: 1, jobName: 1 }, { unique: true });

const Job = mongoose.model('Job', JobSchema);

Job.createJob = async (job, cb) => {
  if (!cb) {
    try {
      await Job.create(job);
      jobEvents.emit('createJob', job);
    } catch (e) {
      throw e;
    }
    return;
  }
  Job.create(job, (err, doc) => {
    if (!err) jobEvents.emit('createJob', job);
    cb(err, doc);
  });
};

Job.findByUser = (user, cb) => {
  const query = { user };
  if (!cb)
    return Job.find(query).exec();
  Job.find(query, cb);
  return null;
};

Job.findByUserAndJobName = (user, jobName, cb) => {
  const query = { user, jobName };
  if (!cb)
    return Job.findOne(query).exec();
  Job.findOne(query, cb);
  return null;
};

Job.getJobNamesLike = (user, namelike, cb) => {
  const aggregate = Job.aggregate([
    {
      $match: {
        user,
        jobName: new RegExp(`${namelike}`),
      },
    },
    {
      $project: {
        _id: 0,
        jobName: 1,
      },
    },
  ]);
  if (!cb)
    return aggregate.exec();
  aggregate.exec(cb);
  return null;
};

Job.getTaskNamesLike = (user, jobName, like, cb) => {
  const aggregate = Job.aggregate([
    {
      $match: {
        user,
        jobName: jobName === '' ? /.*/ : jobName,
      },
    },
    {
      $project: {
        _id: 0,
        taskName: '$tasks.taskName',
      },
    },
    {
      $unwind: '$taskName',
    },
    {
      $match: {
        taskName: new RegExp(`${like}`),
      },
    },
  ]);
  if (!cb)
    return aggregate.exec();
  aggregate.exec(cb);
  return null;
};

Job.getAll = (cb) => {
  if (!cb)
    return Job.find({}).exec();
  Job.find({}, cb);
  return null;
};

Job.deleteJobById = async (jobId, cb) => {
  Job.findByIdAndDelete(jobId, (err, doc) => {
    if (err && !cb) throw err;
    jobEvents.emit('deleteJob', doc.jobName);
    if (cb)
      cb(err, doc);
  });
};

Job.deleteJob = async (user, jobName, cb) => {
  const query = { user, jobName };
  Job.findOneAndDelete(query, (err, doc) => {
    if (err && !cb) throw err;
    jobEvents.emit('deleteJob', jobName);
    if (cb)
      cb(err, doc);
  });
};

Job.updateJob = async (user, jobName, job, cb) => {
  const query = { user, jobName };
  const newJob = job.toObject();
  delete newJob._id;
  Job.findOneAndUpdate(query, newJob, { upsert: true, new: true }, (err, doc) => {
    if (err && !cb) throw err;
    jobEvents.emit('updateJob', doc);
    if (cb)
      cb(err, doc);
  });
};

const demos = new Job({
  user: '5b505aa4b3b22f3474706874',
  jobName: 'demos',
  interval: '* * * * *',
  type: 'LocalJob',
  tasks: [
    {
      taskName: 'DemoUsers',
      type: 'numberIntSerie',
      task: {
        min: 1000,
        max: 1500,
        iteration: 50,
      },
    },
    {
      taskName: 'DemoMaster',
      type: 'text',
      task: {
        texts: ['success', 'failed'],
      },
    },
    {
      taskName: 'DemoDevelop',
      type: 'text',
      task: {
        texts: ['success', 'failed'],
      },
    },
    {
      taskName: 'DemoConversion',
      type: 'number',
      task: {
        min: 1.3,
        max: 1.4,
      },
    },
    {
      taskName: 'DemoProgress',
      type: 'numberInt',
      task: {
        min: 1,
        max: 100,
      },
    },
    {
      taskName: 'DemoHistogram',
      type: 'graphSerie',
      task: {
        min: 1,
        max: 10,
        iteration: 3,
        categories: ['Apples', 'Blackberries', 'Bananas'],
        seriesNames: ['John', 'Carl', 'Susan'],
      },
    },
  ],
});

try {
  Job.createJob(demos);
} catch (e) {
  logger('jobs', '\'demos\' job already saved in db.');
}


module.exports = Job;
