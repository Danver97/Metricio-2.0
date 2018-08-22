const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  user: {
    type: String,
  },
  jobName: {
    type: String,
  },
  jobQuery: {
    type: String,
  },
  datasource: {
    type: String,
  },
  aggregator: {
    type: String,
  },
});

JobSchema.index({ user: 1, jobName: 1 }, { unique: true });

const Job = mongoose.model('Job', JobSchema);

Job.create = (job, cb) => {
  job.save(cb);
};

Job.findByUser = (user, cb) => {
  const query = { user };
  Job.find(query, cb);
};

Job.findByUserAndJobName = (user, jobName, cb) => {
  const query = { user, jobName };
  Job.findOne(query, cb);
};

module.exports = Job;
