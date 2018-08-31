import { getUserFromRequest } from '../lib/utils';

const express = require('express');

const Job = require('../models/job');
const responses = require('../lib/responses');
// const ENV = require('../config/env');

const router = express.Router();

router.use(getUserFromRequest);

router.get('/', (req, res) => {
  res.status(200);
  res.json({ message: '/jobs' });
});

router.get('/list', async (req, res) => {
  try {
    const jobs = await Job.findByUser(req.user.id);
    res.status(200);
    res.json(jobs);
  } catch (e) {
    responses.internalServerError(res, e.message);
  }
});

router.get('/job', async (req, res) => {
  const query = req.query;
  try {
    const job = await Job.findByUserAndJobName(req.user.id, query.jobName);
    res.status(200);
    res.json(job);
  } catch (e) {
    responses.internalServerError(res, e.message);
  }
});

router.get('/getJobNamesLike', async (req, res) => {
  const query = req.query;
  try {
    const jobs = await Job.getJobNamesLike(req.user.id, query.jobNameLike);
    res.status(200);
    res.json(jobs);
  } catch (e) {
    responses.internalServerError(res, e.message);
  }
});

router.get('/getTaskNamesLike', async (req, res) => {
  const query = req.query;
  try {
    const jobs = await Job.getTaskNamesLike(req.user.id, query.jobName, query.taskNameLike);
    res.status(200);
    res.json(jobs);
  } catch (e) {
    responses.internalServerError(res, e.message);
  }
});


router.post('/create', async (req, res) => {
  const body = req.body;
  try {
    const job = new Job({
      name: body.name,
      jobName: body.jobName,
      tasks: JSON.parse(body.tasks),
    });
    Job.createJob(job);
  } catch (e) {
    responses.internalServerError(res, e.message);
  }
});

module.exports = router;
