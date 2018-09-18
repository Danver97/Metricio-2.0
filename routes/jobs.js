import { getUserFromRequest } from '../lib/utils';

const express = require('express');

const jobsMgr = require('../managers/jobsManager');
const JobList = require('../models/jobTypes');
const responses = require('../lib/responses');
// const ENV = require('../config/env');

const router = express.Router();

router.use(getUserFromRequest);

router.get('/types', async (req, res) => {
  console.log('jobTypes');
  const jobTypes = await JobList.getJobTypes();
  res.json(jobTypes.types);
});

router.get('/list/:dashboard', async (req, res) => {
  const params = req.params;
  try {
    let jobs = await jobsMgr.findByUserAndDashboard(req.user.id, params.dashboard);
    jobs = jobs.filter(j => j.jobName !== 'demos');
    res.status(200);
    res.json(jobs);
  } catch (e) {
    responses.internalServerError(res, e.message);
  }
});

router.get('/listAll', async (req, res) => {
  try {
    let jobs = await jobsMgr.findByUser(req.user.id);
    jobs = jobs.filter(j => j.jobName !== 'demos');
    res.status(200);
    res.json(jobs);
  } catch (e) {
    responses.internalServerError(res, e.message);
  }
});

router.get('/job/:jobName', async (req, res) => {
  const params = req.params;
  if (params.jobName === 'demos') {
    responses.internalServerError(res, 'No such job');
    return;
  }
  try {
    const job = await jobsMgr.findByUserAndJobName(req.user.id, params.jobName);
    res.status(200);
    res.json(job);
  } catch (e) {
    responses.internalServerError(res, e.message);
  }
});

router.get('/getJobNamesLike', async (req, res) => {
  const query = req.query;
  try {
    const jobs = await jobsMgr.getJobNamesLike(req.user.id, query.jobNameLike);
    res.status(200);
    res.json(jobs);
  } catch (e) {
    responses.internalServerError(res, e.message);
  }
});

router.get('/getTaskNamesLike', async (req, res) => {
  const query = req.query;
  try {
    const tasks = await jobsMgr.getTaskNamesLike(req.user.id, query.jobName, query.taskNameLike);
    res.status(200);
    res.json(tasks);
  } catch (e) {
    responses.internalServerError(res, e.message);
  }
});

router.post('/create', async (req, res) => {
  const body = req.body;
  try {
    await jobsMgr.createJob({
      user: req.user.id,
      jobName: body.jobName,
      dashboard: body.dashboard,
      interval: body.interval,
      type: body.type,
      tasks: JSON.parse(body.tasks),
    });
    res.status(200);
    res.end();
  } catch (e) {
    responses.internalServerError(res, e.message);
  }
});

router.post('/update/:jobName', async (req, res) => {
  const params = req.params;
  const body = req.body;
  const job = {
    user: req.user.id,
    jobName: body.jobName,
    interval: body.interval,
    type: body.type,
    tasks: JSON.parse(body.tasks),
  };
  try {
    await jobsMgr.updateJob(req.user.id, params.jobName, job);
    res.status(200);
    res.end();
  } catch (e) {
    console.log(e);
    responses.internalServerError(res, e.message);
  }
});

router.post('/delete/:jobName', async (req, res) => {
  const params = req.params;
  try {
    await jobsMgr.deleteJob(req.user.id, params.jobName);
    res.status(200);
    res.end();
  } catch (e) {
    console.log(e);
    responses.internalServerError(res, e.message);
  }
});

module.exports = router;
