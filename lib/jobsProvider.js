import RequireAll from 'require-all';
import paths from '../config/paths';
import JobStructures from '../src/lib/structures/jobsStructures';

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

async function exportFunction(addNewJobFunc) {
  jobEvent.on('createJob', (job) => {
    // Subscribe new job to NodeResque
    const JobStruct = JobStructures[job.type];
    const jobStr = JobStruct.fromObject(job).getJob();
    if (addNewJobFunc)
      addNewJobFunc(jobStr);
    console.log('createJob event handled!');
  });
  // return jobs saved on the db
  const JOBS = RequireAll(paths.jobs);
  const jobsArr = await getJobsFromDb();
  const jobs = {};
  jobsArr.forEach(j => {
    const JobStruct = JobStructures[j.type];
    const jobStr = JobStruct.fromObject(j).getJob();
    jobs[j.jobName] = jobStr[j.jobName];
  });
  Object.keys(JOBS).forEach(k => { jobs[k] = JOBS[k]; });
  return jobs;
}

module.exports = exportFunction;
