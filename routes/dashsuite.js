import Dashboard from '../models/dashboard';
import { getUserFromRequest } from '../lib/utils';

const express = require('express');

const Dashsuite = require('../models/dashsuite');
const responses = require('../lib/responses');

const router = express.Router();

router.get('/dashboards/:dashsuite', getUserFromRequest, (req, res) => {
  Dashsuite.findByUserAndDashSuiteName(req.user.id, req.params.dashsuite, true, (err, doc) => {
    if (err) throw err;
    if (!doc) {
      responses.notFound(res);
      return;
    }
    res.json(doc);
  });
});

router.get('/list', getUserFromRequest, (req, res) => {
  Dashsuite.findByUser(req.user.id, (err, docs) => {
    if (err) throw err;
    if (!docs) {
      responses.notFound(res);
      return;
    }
    res.json(docs);
  });
});

router.post('/create', getUserFromRequest, async (req, res) => {
  const body = req.body;
  if (!body.name) {
    responses.badRequest(res, 'Missing body "name" parameter.');
    return;
  }
  try {
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
  }
});

router.post('/delete/:dashsuite', getUserFromRequest, async (req, res) => {
  try {
    const doc = await Dashsuite.findByUserAndDashSuiteName(req.user.id, req.params.dashsuite);
    await Dashboard.deleteById(doc.dashboards);
    await Dashsuite.deleteDash(req.user.id, req.params.dashsuite);
    res.status(200);
    res.json({ message: 'success' });
  } catch (e) {
    responses.badRequest(res, e.message);
  }
});

module.exports = router;
