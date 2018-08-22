const express = require('express');
const router = express.Router();
const Dashboard = require('../models/dashboard');
import { ensureAutenticated, ensureAndVerifyToken } from '../lib/utils';

router.get('/:dashboard', ensureAndVerifyToken, (req, res) => {
  res.render('index', {
    name: req.params.dashboard,
    layout: false,
  });
});

router.get('/:dashboard/getStructure', ensureAndVerifyToken, (req, res) => {
  Dashboard.findByUserAndDashboardName(req.decodedToken.user._id, req.params.dashboard, (err, doc) => {
    if (err) throw err;
    res.json(doc);
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
      structure = JSON.parse(req.body.structure)
      console.log(structure);
    } catch(e){
      res.end(e);
    }
    const idx = doc.children.findIndex(x => x.attrs.key === structure.attrs.key);
    doc.children[idx] = structure;
    Dashboard.updateOne({
      user: doc.user,
      name: doc.name,
    }, doc, { upsert: true }, (err) => {
      if (err) throw err;
      // res.end('/dashboard/' + doc.name);
      res.end('edit: got it!');
    });
  });
});

module.exports = router;
