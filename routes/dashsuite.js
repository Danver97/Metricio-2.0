import DashSuite from '../models/dashSuite';
import Dashboard from '../models/dashboard';
import { ensureAutenticated, ensureAndVerifyToken } from '../lib/utils';

const express = require('express');

const router = express.Router();

router.get('/', ensureAutenticated, (req, res) => {
  res.render('index', {
    name: 'dashsuites',
  });
});

router.get('/create', ensureAutenticated, (req, res) => {
  //res.end('/dashsuites/create');
  res.render('index', {
    name: 'dashsuiteCreate',
  });
});

router.get('/view/:dashsuite', ensureAutenticated, (req, res) => {
  //res.end('/dashsuites/view');
  res.render('index', {
    name: 'dashsuiteView',
  });
});

router.get('/dashboards/:dashsuite', ensureAndVerifyToken, (req, res) => {
  DashSuite.findByUserAndDashSuiteName(req.decodedToken.user._id, req.params.dashsuite, true, (err, doc) => {
    if (err) throw err;
    if(!doc){
      res.status(400);
      res.json({error: "a"});
      return;
    }
    res.json(doc);
  });
});

router.get('/list', ensureAndVerifyToken, (req, res) => {
  DashSuite.findByUser(req.decodedToken.user._id, (err, docs) => {
    if (err) throw err;
    res.json(docs);
  });
});

router.post('/create', ensureAndVerifyToken, async (req, res) => {
  let dashboardsArr;
  try {
    dashboardsArr = JSON.parse(req.body.dashboards);
  } catch (e) {
    dashboardsArr = [];
  }
  try {
    const result = await Dashboard.findByUserAndDashboardNames(req.decodedToken.user._id, dashboardsArr, { _id: 1 });
    dashboardsArr = result.map(e => e._id);
  } catch(e) {
    throw e;
  }
  const dashS = new DashSuite({
    user: '5b505aa4b3b22f3474706874',
    name: req.body.name || 'name',
    dashboards: dashboardsArr,
    link: `/dashsuites/view/${req.body.name}`,
    lastModified: '5b505aa4b3b22f3474706874',
  });
  console.log(dashS);
  DashSuite.create(dashS, (err) => {
    if (err) throw err;
  });
  res.end();
});

module.exports = router;
