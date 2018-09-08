import RequireAll from 'require-all';
import paths from '../config/paths';
import JobStructures from '../src/lib/structures/jobsStructures';

const Job = require('../models/job');
const jobEvent = require('../listeners/jobListener');

async function getJobsFromDb(addNewJobFunc, removeJobFunc) {
  jobEvent.on('createJob', (job) => {
    // Subscribe new job to NodeResque
    const JobStruct = JobStructures[job.type];
    const jobStr = JobStruct.fromObject(job).getJob();
    if (addNewJobFunc)
      addNewJobFunc(jobStr);
  });
  
  jobEvent.on('deleteJob', (jobName) => {
    // Remove subscribed job from NodeResque
    if (removeJobFunc)
      removeJobFunc(jobName);
  });
  // return jobs saved on the db
  const JOBS = RequireAll(paths.jobs);
  const jobsArr = await Job.getAll();
  const jobs = {};
  Object.keys(JOBS).forEach(k => { jobs[k] = JOBS[k]; });
  jobsArr.forEach(j => {
    if (!j.type)
      return;
    const JobStruct = JobStructures[j.type];
    if (JobStruct) {
      try {
        const jobStr = JobStruct.fromObject(j).getJob();
        jobs[j.jobName] = jobStr[j.jobName];
      } catch (e) {
        console.log(e);
      }
    }
  });
  console.log(jobs);
  return jobs;
}

module.exports = getJobsFromDb;
