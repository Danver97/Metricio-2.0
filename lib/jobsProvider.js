import RequireAll from 'require-all';
import paths from '../config/paths';
import JobStructures from '../lib/jobsStructures';

const Job = require('../models/job');
const jobEvent = require('../listeners/eventBus');

async function getJobsFromDb(addNewJobFunc, removeJobFunc) {
  const scheduleNewJob = (job, vars) => {
    // Subscribe new job to NodeResque asyncronously
    
    setImmediate(() => {
      if (job.parameters || (Array.isArray(job.parameters) && job.parameters.length > 0))
        job.interval = '*/10 * * * * *';
      const JobStruct = JobStructures[job.type];
      const jobStr = JobStruct.fromObject(job, vars).getJob();
      if (addNewJobFunc)
        addNewJobFunc(jobStr);
    });
  };
  const removeScheduledJob = (job) => {
    // Remove subscribed job from NodeResque asyncronously
    setImmediate(() => {
      if (removeJobFunc)
        removeJobFunc(job.jobName);
    });
  };
  
  jobEvent.on('createJob', scheduleNewJob);
  jobEvent.on('startParametrizedJob', scheduleNewJob);
  jobEvent.on('stopParametrizedJob', removeScheduledJob);
  jobEvent.on('deleteJob', removeScheduledJob);
  
  // return jobs saved on the db
  const JOBS = RequireAll(paths.jobs);
  const jobsArr = await Job.getAll();
  const jobs = {};
  Object.keys(JOBS).forEach(k => { jobs[k] = JOBS[k]; });
  jobsArr.forEach(j => {
    if (!j.type || j.parameters || (Array.isArray(j.parameters) && j.parameters.length > 0))
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
