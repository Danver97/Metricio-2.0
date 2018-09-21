import { getUserFromRequest } from '../lib/utils';

const express = require('express');

const dashboardMgr = require('../managers/dashboardManager');
const dashsuiteMgr = require('../managers/dashsuiteManager');
const responses = require('../lib/responses');

const router = express.Router();

router.use(getUserFromRequest);

router.get('/getStructure/:dashboard', async (req, res) => {
  if (!req.params.dashboard) {
    responses.badRequest(res, 'Missing \'dashboard\' param.');
    return;
  }
  try {
    const doc = await dashboardMgr.findByUserAndDashboardName(req.user.id, req.params.dashboard);
    if (!doc) {
      responses.notFound(res, 'Dashboard not found.');
      return;
    }
    res.json(doc);
  } catch (e) {
    responses.internalServerError(res, e.message);
  }
});

router.get('/getComponentStructure/:dashboard', async (req, res) => {
  const query = req.query;
  if (!query.compId) {
    responses.badRequest(res, 'Missing query param \'compId.\'');
    return;
  }
  if (!req.params.dashboard) {
    responses.badRequest(res, 'Missing \'dashboard\' param.');
    return;
  }
  try {
    const doc = await dashboardMgr.findByUserAndDashboardName(req.user.id, req.params.dashboard);
    if (!doc) {
      responses.notFound(res, 'Dashboard not found.');
      return;
    }
    const compStr = doc.children.filter(c => c.attrs.id === query.compId || c.attrs.key === query.compId)[0];
    if (!compStr) {
      responses.notFound(res, 'Component not found.');
      return;
    }
    res.json(compStr);
  } catch (e) {
    responses.internalServerError(res, e.message);
  }
});

router.get('/getVars/:dashboard', async (req, res) => {
  if (!req.params.dashboard) {
    responses.badRequest(res, 'Missing \'dashboard\' param.');
    return;
  }
  try {
    const doc = await dashboardMgr.findByUserAndDashboardName(req.user.id, req.params.dashboard);
    if (!doc) {
      responses.notFound(res, 'Dashboard not found.');
      return;
    }
    res.json(doc.vars);
  } catch (e) {
    responses.internalServerError(res, e.message);
  }
});

router.get('/listAll', async (req, res) => {
  try {
    const docs = await dashboardMgr.findByUser(req.user.id);
    if (!docs) {
      responses.notFound(res);
      return;
    }
    res.status(200);
    res.json(docs);
  } catch (e) {
    responses.internalServerError(res, e.message);
  }
});

router.post('/create', async (req, res) => {
  const body = req.body;
  if (!body.name || !body.dashsuite) {
    responses.badRequest(res, `Missing param ${!body.name ? 'name' : ''} ${!body.dashsuite ? 'dashsuite' : ''}`);
    return;
  }
  try {
    const dashsuite = await dashsuiteMgr.findByUserAndDashSuiteName(req.user.id, body.dashsuite, false);
    const newDash = {
      user: req.user.id,
      name: body.name,
      isMain: body.ismain,
      dashsuite: dashsuite._id,
      variables: JSON.parse(body.variables),
    };
    await dashboardMgr.createDash(newDash);
    res.status(200);
    res.end();
  } catch (e) {
    console.log(e);
    responses.internalServerError(res, e.message);
  }
});

router.post('/delete/:dashboard', async (req, res) => {
  if (!req.params.dashboard) {
    responses.badRequest(res, 'Missing param \'dashboard\'');
    return;
  }
  try {
    await dashboardMgr.deleteByName(req.user.id, req.params.dashboard);
    res.status(200);
    res.end();
  } catch (e) {
    console.log(e);
    responses.internalServerError(res, e.message);
  }
});

router.post('/save/:dashboard', async (req, res) => {
  if (!req.body.layout) {
    responses.badRequest(res, 'Missing body \'layout\' param.');
  }
  try {
    const dashLayout = JSON.parse(req.body.layout);
    const newDash = {
      user: req.user.id,
      name: dashLayout.name,
      children: dashLayout.children,
      subdashboard: [],
      layouts: dashLayout.layouts,
    };
    await dashboardMgr.updateDash(newDash);
    res.status(200);
    res.end();
  } catch (e) {
    responses.internalServerError(res, e.message);
  }
});

router.post('/edit/:dashboard', async (req, res) => {
  if (!req.params.dashboard) {
    responses.badRequest(res, 'Missing \'dashboard\' param.');
    return;
  }
  if (!req.body.structure) {
    responses.badRequest(res, 'Missing \'structure\' body param.');
    return;
  }
  try {
    const doc = await dashboardMgr.findByUserAndDashboardName(req.user.id, req.params.dashboard);
    if (!doc) {
      responses.notFound(res, 'Dashboard not found.');
      return;
    }
    const structure = JSON.parse(req.body.structure);
    const idx = doc.children.findIndex(x => x.attrs.key === structure.attrs.key);
    if (idx === -1) {
      responses.notFound(res, 'Component not found.');
      return;
    }
    doc.children[idx] = structure;
    await dashboardMgr.updateDash(doc);
    res.status(200);
    res.end();
  } catch (e) {
    responses.internalServerError(res, e.message);
  }
});

router.post('/newWidget/:dashboard', async (req, res) => {
  if (!req.params.dashboard) {
    responses.badRequest(res, 'Missing \'dashboard\' param.');
    return;
  }
  if (!req.body.structure) {
    responses.badRequest(res, 'Missing \'structure\' body param.');
    return;
  }
  try {
    const doc = await dashboardMgr.findByUserAndDashboardName(req.user.id, req.params.dashboard);
    if (!doc) {
      responses.notFound(res, 'Dashboard not found.');
      return;
    }
    const structure = JSON.parse(req.body.structure);
    doc.children.push(structure);
    await dashboardMgr.updateDash(doc);
    res.status(200);
    res.end();
  } catch (e) {
    responses.internalServerError(res, e.message);
  }
});

router.post('/saveVars/:dashboard', async (req, res) => {
  if (!req.params.dashboard) {
    responses.badRequest(res, 'Missing \'dashboard\' param.');
    return;
  }
  try {
    const doc = await dashboardMgr.findByUserAndDashboardName(req.user.id, req.params.dashboard);
    if (!doc) {
      responses.notFound(res, 'Dashboard not found.');
      return;
    }
    const variables = JSON.parse(req.body.variables);
    doc.vars = variables;
    await dashboardMgr.updateDash(doc);
    res.status(200);
    res.end();
  } catch (e) {
    console.log(e);
    responses.internalServerError(res, e.message);
  }
});

router.post('/startParametrizedJobs/:dashboard', async (req, res) => {
  if (!req.params.dashboard) {
    responses.badRequest(res, 'Missing \'dashboard\' param.');
    return;
  }
  try {
    const doc = await dashboardMgr.findByUserAndDashboardName(req.user.id, req.params.dashboard, true);
    if (!doc) {
      responses.notFound(res, 'Dashboard not found.');
      return;
    }
    const vars = JSON.parse(req.body.variables) || {};
    const parametrizedJobs = doc.jobs.filter(j => !!j.parameters || (Array.isArray(j.parameters) && j.parameters.length > 0));
    parametrizedJobs.forEach(j => dashboardMgr.startJob(j, vars));
    res.status(200);
    res.end();
  } catch (e) {
    console.log(e);
    responses.internalServerError(res, e.message);
  }
});

router.post('/stopParametrizedJobs/:dashboard', async (req, res) => {
  if (!req.params.dashboard) {
    responses.badRequest(res, 'Missing \'dashboard\' param.');
    return;
  }
  try {
    const doc = await dashboardMgr.findByUserAndDashboardName(req.user.id, req.params.dashboard, true);
    if (!doc) {
      responses.notFound(res, 'Dashboard not found.');
      return;
    }
    const parametrizedJobs = doc.jobs.filter(j => !!j.parameters || (Array.isArray(j.parameters) && j.parameters.length > 0));
    parametrizedJobs.forEach(j => dashboardMgr.stopJob(j));
    res.status(200);
    res.end();
  } catch (e) {
    console.log(e);
    responses.internalServerError(res, e.message);
  }
});

module.exports = router;
