const express = require('express');
const router = express.Router();
const Dashboard = require('../models/dashboard');
import { ensureAutenticated, ensureAndVerifyToken } from '../lib/utils';

const badRequest = (res, message) => {
  res.status(400);
  res.json({ error: message });
};

const notFound = (res, message) => {
  res.status(404);
  res.json({ error: message });
};

router.get('/:dashboard/getStructure', ensureAndVerifyToken, (req, res) => {
  Dashboard.findByUserAndDashboardName(req.decodedToken.user._id, req.params.dashboard, (err, doc) => {
    if (err) throw err;
    if (!doc) {
      notFound(res, 'Dashboard not found.');
      return;
    }
    res.json(doc);
  });
});

router.get('/:dashboard/getComponentStructure', ensureAndVerifyToken, (req, res) => {
  const query = req.query;
  if (!query.compId) {
    badRequest(res, 'Missing param compId.')
    return;
  }
  Dashboard.findByUserAndDashboardName(req.decodedToken.user._id, req.params.dashboard, (err, doc) => {
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

router.post('/:dashboard/save', ensureAutenticated, (req, res) => {
  const dashLayout = JSON.parse(req.body.layout);
  const newDash = new Dashboard({
    user: 'Christian',
    name: dashLayout[0].name,
    children: dashLayout[0].children,
    subdashboard: [],
    layouts: dashLayout[0].layouts,
  });
  Dashboard.create(newDash, (err, dash) => {
    if (err) throw err;
    console.log(dash);
  });
  res.end();
});

router.post('/:dashboard/edit', ensureAutenticated, (req, res) => {
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
    }, doc, { upsert: true }, (error) => {
      if (error) throw error;
      res.end('edit: got it!');
    });
  });
});

module.exports = router;
