import urlPaths from '../src/lib/url_paths';

const mongoose = require('mongoose');

// User Schema
const DashboardSchema = mongoose.Schema({
  user: {
    type: String, // mongoose.Schema.Types.ObjectId,
  },
  dashsuite: {
    type: mongoose.Schema.Types.ObjectId,
  },
  name: {
    type: String,
  },
  isMain: {
    type: Boolean,
  },
  subdashboard: {
    type: Array,
    default: [],
  },
  children: {
    type: Array,
    default: [],
  },
  layouts: {
    type: Array,
    default: [],
  },
  create: {
    type: String,
    default: urlPaths.dashboard.get.create(),
  },
});

DashboardSchema.pre('save', function (next) {
  this.view = urlPaths.dashboard.get.dashboard(this.name);
  this.delete = urlPaths.dashboard.post.delete(this.name);
  next();
});

DashboardSchema.pre('update', function (next) {
  this.view = urlPaths.dashboard.get.dashboard(this.name);
  this.delete = urlPaths.dashboard.post.delete(this.name);
  next();
});

DashboardSchema.index({ user: 1, dashsuite: 1, name: 1 }, { unique: true });

const Dashboard = mongoose.model('Dashboard', DashboardSchema);

Dashboard.createDash = (dashboard, cb) => {
  if (!cb)
    return Dashboard.create(dashboard);
  Dashboard.create(dashboard, cb);
  return undefined;
};

Dashboard.updateDash = (dashboard, cb) => {
  const newDash = dashboard.toObject();
  delete newDash._id;
  if (!cb)
    return Dashboard.findOneAndUpdate({ user: dashboard.user, name: dashboard.name }, newDash, { upsert: true, new: true }).exec();
  Dashboard.updateOne({ user: dashboard.user, name: dashboard.name }, newDash, { upsert: true, new: true }, cb);
  return undefined;
};

Dashboard.findByUser = (user, cb) => {
  const query = { user };
  if (!cb)
    return Dashboard.find(query).exec();
  Dashboard.find(query, cb);
  return undefined;
};

Dashboard.findByUserAndDashboardName = (user, dashboardName, cb) => {
  const query = { user, name: dashboardName };
  if (!cb)
    return Dashboard.findOne(query).exec();
  Dashboard.findOne(query, cb);
  return undefined;
};

Dashboard.findByUserAndDashboardNames = (user, dashboardNames, projection, cb) => {
  const query = { user, name: { $in: dashboardNames } };
  if (!projection)
    projection = null;
  if (!cb)
    return Dashboard.find(query, projection).exec();
  Dashboard.find(query, projection, cb);
  return undefined;
};

module.exports = Dashboard;
