import logger from '../lib/logger';

const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  dashboard: {
    type: String,
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
  parameters: {
    type: Boolean, // [String],
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
    return Job.create(job);
  }
  Job.create(job, cb);
  return null;
};

Job.findByUser = (user, cb) => {
  const query = { user };
  if (!cb)
    return Job.find(query).exec();
  Job.find(query, cb);
  return null;
};

Job.findByUserAndDashboard = (user, dashboard, cb) => {
  const query = { user, dashboard };
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
        $or: [{
          user: new mongoose.Types.ObjectId(user),
          jobName: new RegExp(`${namelike}`),
        }, {
          jobName: 'demos',
        }],
      },
    },
    {
      $project: {
        _id: 0,
        jobName: 1,
      },
    },
  ]);
  if (!cb) {
    return aggregate.exec();
  }
  aggregate.exec(cb);
  return null;
};

Job.getTaskNamesLike = (user, jobName, like, cb) => {
  console.log(user);
  console.log(jobName);
  const aggregate = Job.aggregate([
    {
      $match: {
        $or: [{
          user: new mongoose.Types.ObjectId(user),
          jobName: jobName === '' ? /.*/ : jobName,
        }, {
          jobName: 'demos',
        }],
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
    /* {
      $match: {
        taskName: new RegExp(`${like}`),
      },
    }, */
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
  if (!cb)
    return Job.findByIdAndDelete(jobId).exec();
  Job.findByIdAndDelete(jobId, cb);
  return null;
};

Job.deleteJob = async (user, jobName, cb) => {
  const query = { user, jobName };
  if (!cb)
    return Job.findOneAndDelete(query).exec();
  Job.findOneAndDelete(query, cb);
  return null;
};

Job.updateJob = async (user, jobName, job, cb) => {
  const query = { user, jobName };
  const newJob = job.toObject();
  delete newJob._id;
  if (!cb)
    return Job.findOneAndUpdate(query, newJob, { upsert: true, new: true });
  Job.findOneAndUpdate(query, newJob, { upsert: true, new: true }, cb);
  return null;
};

/* const demos = new Job({
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
      taskName: 'DemoMultiProgress',
      type: 'numberMinMax',
      task: {
        iterations: 4,
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
Job.createJob(demos, (err) => {
  if (err)
    logger('jobs', '\'demos\' job already saved in db.');
}); */

module.exports = Job;
