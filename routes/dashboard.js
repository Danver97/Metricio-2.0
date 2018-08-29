import { getUserFromRequest } from '../lib/utils';

const express = require('express');
const Dashboard = require('../models/dashboard');
const Dashsuite = require('../models/dashsuite');

const router = express.Router();

const badRequest = (res, message) => {
  res.status(400);
  if (message)
    res.json({ error: message });
  else 
    res.end();
};

const notFound = (res, message) => {
  res.status(404);
  if (message)
    res.json({ error: message });
  else 
    res.end();
};

const internalServerError = (res, message) => {
  res.status(500);
  if (message)
    res.json({ error: message });
  else 
    res.end();
};

router.use(getUserFromRequest);

router.get('/getStructure/:dashboard', (req, res) => {
  Dashboard.findByUserAndDashboardName(req.user.id, req.params.dashboard, (err, doc) => {
    if (err) throw err;
    if (!doc) {
      notFound(res, 'Dashboard not found.');
      return;
    }
    res.json(doc);
  });
});

router.get('/getComponentStructure/:dashboard', (req, res) => {
  const query = req.query;
  if (!query.compId) {
    badRequest(res, 'Missing param compId.');
    return;
  }
  Dashboard.findByUserAndDashboardName(req.user.id, req.params.dashboard, (err, doc) => {
    if (err) throw err;
    if (!doc) {
      notFound(res, 'Dashboard not found.');
      return;
    }
    const compStr = doc.children.filter(c => c.attrs.id === query.compId ||
                                        c.attrs.key === query.compId)[0];
    if (!compStr) {
      notFound(res, 'Component not found.');
      return;
    }
    res.json(compStr);
  });
});

router.get('/listAll', async (req, res) => {
  try {
    const docs = await Dashboard.findByUser(req.user.id);
    if (!docs) {
      notFound(res);
      return;
    }
    res.status(200);
    res.json(docs);
  } catch (e) {
    internalServerError(res, e.message);
  }
});

router.post('/save/:dashboard', (req, res) => {
  const dashLayout = JSON.parse(req.body.layout);
  const newDash = new Dashboard({
    user: 'Christian',
    name: dashLayout[0].name,
    children: dashLayout[0].children,
    subdashboard: [],
    layouts: dashLayout[0].layouts,
  });
  Dashboard.updateDash(newDash, (err, dash) => {
    if (err) throw err;
    console.log(dash);
  });
  res.end();
});

router.post('/edit/:dashboard', (req, res) => {
  Dashboard.findByUserAndDashboardName('Christian', req.params.dashboard, (err, doc) => {
    if (err) throw err;
    let structure;
    try {
      structure = JSON.parse(req.body.structure);
      console.log(structure);
    } catch (e) {
      res.end(e);
    }
    const idx = doc.children.findIndex(x => x.attrs.key === structure.attrs.key);
    doc.children[idx] = structure;
    Dashboard.updateOne({
      user: doc.user,
      name: doc.name,
    }, doc, { upsert: true, new: true }, (error) => {
      if (error) throw error;
      res.end('edit: got it!');
    });
  });
});

router.post('/create', async (req, res) => {
  const body = req.body;
  if (!body.name || !body.dashsuite) {
    badRequest(res, `Missing param ${!body.name ? 'name' : ''} ${!body.dashsuite ? 'dashsuite' : ''}`);
    return;
  }
  try {
    const dashsuite = await Dashsuite.findByUserAndDashSuiteName(req.user.id, body.dashsuite, false);
    const newDash = new Dashboard({
      user: req.user.id,
      name: body.name,
      isMain: body.ismain,
      dashsuite: dashsuite._id,
      variables: JSON.parse(body.variables),
    });
    const doc = await Dashboard.createDash(newDash);
    dashsuite.dashboards.push(doc._id);
    await Dashsuite.updateDash(dashsuite);
    res.status(200);
    res.end();
  } catch (e) {
    console.log(e);
    internalServerError(res, e.message);
  }
});

module.exports = router;
