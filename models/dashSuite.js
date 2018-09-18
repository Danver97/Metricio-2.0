import urlPaths from '../src/lib/url_paths';

const mongoose = require('mongoose');

// User Schema
const DashboardSuiteSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  link: {
    type: String,
  },
  dashboards: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dashboard',
  }],
  lastModified: {
    type: String,
  },
  create: {
    type: String,
    default: urlPaths.dashsuites.get.create(),
  },
  list: {
    type: String,
    default: urlPaths.dashsuites.get.list(),
  },
  view: String,
  delete: String,
});

DashboardSuiteSchema.pre('save', function (next) {
  this.view = urlPaths.dashsuites.get.view(this.name);
  this.delete = urlPaths.dashsuites.post.delete(this.name);
  next();
});

DashboardSuiteSchema.pre('update', function (next) {
  this.view = urlPaths.dashsuites.get.view(this.name);
  this.delete = urlPaths.dashsuites.post.delete(this.name);
  next();
});

DashboardSuiteSchema.index({ user: 1, name: 1 }, { unique: true });

const DashboardSuite = mongoose.model('DashboardSuite', DashboardSuiteSchema);

DashboardSuite.createDash = (dashsuite, cb) => {
  if (!cb)
    return DashboardSuite.create(dashsuite);
  DashboardSuite.create(dashsuite, cb);
  return null;
};

DashboardSuite.updateDash = (dashsuite, cb) => {
  const newSuite = dashsuite.toObject();
  delete newSuite._id;
  if (!cb) 
    return DashboardSuite.findOneAndUpdate({ user: dashsuite.user, name: dashsuite.name }, newSuite, { upsert: true, new: true }).exec();
  DashboardSuite.findOneAndUpdate(
    {
      user: dashsuite.user,
      name: dashsuite.name,
    },
    newSuite, { upsert: true, new: true }, cb
  );
  return null;
};

DashboardSuite.findUsingId = (id, cb) => {
  if (!cb)
    return DashboardSuite.findById(id).exec();
  DashboardSuite.findById(id, cb);
  return null;
};

DashboardSuite.findByUser = (user, cb) => {
  const query = { user };
  if (!cb)
    return DashboardSuite.find(query).exec();
  DashboardSuite.find(query, cb);
  return null;
};

DashboardSuite.findByUserAndDashSuiteName = (user, dashSuiteName, populate, cb) => {
  const query = { user, name: dashSuiteName };
  if (!cb) {
    if (populate)
      return DashboardSuite.findOne(query).populate('dashboards', { layouts: 0 }).exec();
    return DashboardSuite.findOne(query).exec();
  }
  if (populate) {
    DashboardSuite.findOne(query).populate('dashboards', { layouts: 0 }).exec(cb);
    return null;
  }
  DashboardSuite.findOne(query, cb);
  return null;
};

DashboardSuite.deleteDash = (user, dashsuiteName, cb) => {
  const query = { user, name: dashsuiteName };
  if (cb) {
    DashboardSuite.findOneAndDelete(query, cb);
    return null;
  }
  return DashboardSuite.findOneAndDelete(query).exec();
};

module.exports = DashboardSuite;
