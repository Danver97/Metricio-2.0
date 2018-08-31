import RequireAll from 'require-all';
import paths from '../config/paths';
import JobStructure from '../src/lib/structures/jobStructure';

const Job = require('../models/job');
const jobEvent = require('../listeners/jobListener');

async function getJobsFromDb() {
  const jobs = await Job.getAll();
  const jobsObj = {};
  jobs.forEach(j => {
    jobsObj[j.jobName] = j;
  });
  return jobsObj;
}

function exportFunction(addNewJobFunc) {
  jobEvent.on('createJob', (job) => {
    // Subscribe new job to NodeResque
    if (addNewJobFunc)
      addNewJobFunc(job);
    console.log('createJob event handled!');
  });
  // return jobs saved on the db
  const JOBS = RequireAll(paths.jobs);
  const jobs = getJobsFromDb(); // rearrangment needed with job structure
  Object.keys(JOBS).forEach(k => { jobs[k] = JOBS[k]; });
  return jobs;
}

module.exports = exportFunction;
