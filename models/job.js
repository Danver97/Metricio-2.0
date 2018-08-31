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
    await Job.create(job);
    jobEvents.emit('createJob', job);
    return;
  }
  Job.create(job, (err, doc) => {
    if (err) throw err;
    jobEvents.emit('createJob', job);
    cb(err, doc);
  });
};

Job.findByUser = (user, cb) => {
  const query = { user };
  if (!cb)
    Job.find(query).exec();
  Job.find(query, cb);
};

Job.findByUserAndJobName = (user, jobName, cb) => {
  const query = { user, jobName };
  if (!cb)
    Job.findOne(query).exec();
  Job.findOne(query, cb);
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
        jobName,
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

module.exports = Job;
