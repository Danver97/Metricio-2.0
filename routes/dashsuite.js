import { getUserFromRequest } from '../lib/utils';

const express = require('express');

const dashsuiteMgr = require('../managers/dashsuiteManager');
const responses = require('../lib/responses');

const router = express.Router();

router.use(getUserFromRequest);

router.get('/dashboards/:dashsuite', async (req, res) => {
  if (!req.params.dashsuite) {
    responses.badRequest(res, 'Required dashsuite param.');
    return;
  }
  try {
    const doc = await dashsuiteMgr.findByUserAndDashSuiteName(req.user.id, req.params.dashsuite, true);
    if (!doc) {
      responses.notFound(res, 'Dashsuite not found.');
      return;
    }
    res.json(doc);
  } catch (e) {
    responses.internalServerError(res, e.message);
  }
  /* Dashsuite.findByUserAndDashSuiteName(req.user.id, req.params.dashsuite, true, (err, doc) => {
    if (err) throw err;
    if (!doc) {
      responses.notFound(res);
      return;
    }
    res.json(doc);
  }); */
});

router.get('/list', async (req, res) => {
  try {
    const docs = await dashsuiteMgr.findByUser(req.user.id);
    if (!docs) {
      responses.notFound(res);
      return;
    }
    res.json(docs);
  } catch (e) {
    responses.internalServerError(res, e.message);
  }
  /* Dashsuite.findByUser(req.user.id, (err, docs) => {
    if (err) throw err;
    if (!docs) {
      responses.notFound(res);
      return;
    }
    res.json(docs);
  }); */
});

router.post('/create', async (req, res) => {
  const body = req.body;
  if (!body.name) {
    responses.badRequest(res, 'Missing body "name" parameter.');
    return;
  }
  try {
    const dashS = {
      user: req.user.id,
      name: body.name,
      link: `/dashsuites/view/${body.name}`,
      lastModified: req.user.id,
    };
    await dashsuiteMgr.createDash(dashS);
    res.status(200);
    res.end();
  } catch (e) {
    console.log(e);
    responses.badRequest(res, e.message);
  }
  /* try {
    const dashS = new Dashsuite({
      user: req.user.id,
      name: body.name,
      link: `/dashsuites/view/${body.name}`,
      lastModified: req.user.id,
    });
    await Dashsuite.createDash(dashS);
    res.status(200);
    res.end();
  } catch (e) {
    console.log(e);
    responses.badRequest(res, e.message);
  } */
});

router.post('/delete/:dashsuite', async (req, res) => {
  if (!req.params.dashsuite) {
    responses.badRequest(res, 'Required dashsuite param.');
    return;
  }
  try {
    await dashsuiteMgr.deleteDash(req.user.id, req.params.dashsuite);
    res.status(200);
    res.end();
  } catch (e) {
    responses.badRequest(res, e.message);
  }
  /* try {
    const doc = await Dashsuite.findByUserAndDashSuiteName(req.user.id, req.params.dashsuite);
    await Dashboard.deleteById(doc.dashboards);
    await Dashsuite.deleteDash(req.user.id, req.params.dashsuite);
    res.status(200);
    res.json({ message: 'success' });
  } catch (e) {
    responses.badRequest(res, e.message);
  } */
});

module.exports = router;
