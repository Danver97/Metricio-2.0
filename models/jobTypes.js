import list from '../lib/jobsStructures';

const mongoose = require('mongoose');

const JobTypesSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'jobList',
  },
  types: [String],
});

const JobTypes = mongoose.model('JobList', JobTypesSchema);

JobTypes.getJobTypes = () => JobTypes.findOne({ name: 'jobList' });

const jobTypes = (new JobTypes({ types: Object.keys(list) })).toObject();
delete jobTypes._id;

JobTypes.findOneAndUpdate({ name: 'jobList' }, jobTypes, { upsert: true }, (err) => {
  if (err) throw err;
});

module.exports = JobTypes;
