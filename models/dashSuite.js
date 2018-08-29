import urlPaths from '../src/lib/url_paths';

const mongoose = require('mongoose');

// User Schema
const DashboardSuiteSchema = mongoose.Schema({
  user: {
    type: String,
  },
  name: {
    type: String,
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
  const newDash = dashsuite.toObject();
  delete newDash._id;
  if (!cb) 
    return DashboardSuite.findOneAndUpdate({ user: dashsuite.user, name: dashsuite.name }, newDash, { upsert: true, new: true }).exec();
  DashboardSuite.findOneAndUpdate(
    {
      user: dashsuite.user,
      name: dashsuite.name,
    },
    newDash, { upsert: true, new: true }, cb
  );
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

DashboardSuite.delete = (user, dashsuiteName, cb) => {
  if (cb) {
    DashboardSuite.deleteOne({ user, name: dashsuiteName }, cb);
    return null;
  }
  return DashboardSuite.deleteOne({ user, name: dashsuiteName }).exec();
};

module.exports = DashboardSuite;
