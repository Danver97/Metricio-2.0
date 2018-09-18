import urlPaths from '../src/lib/url_paths';

const mongoose = require('mongoose');

// User Schema
const DashboardSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  dashsuite: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dashsuite',
    required: true,
  },
  jobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
  }],
  name: {
    type: String,
    required: true,
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
  vars: {
    type: [{
      name: {
        type: String,
      },
      type: {
        type: String,
      },
    }],
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
  delete: String,
  view: String,
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
  return null;
};

Dashboard.updateDash = (dashboard, cb) => {
  const newDash = dashboard.toObject();
  delete newDash._id;
  if (!cb)
    return Dashboard.findOneAndUpdate({ user: dashboard.user, name: dashboard.name }, newDash, { upsert: true, new: true }).exec();
  Dashboard.updateOne({ user: dashboard.user, name: dashboard.name }, newDash, { upsert: true, new: true }, cb);
  return null;
};

Dashboard.findUsingId = (id, cb) => {
  if (!cb)
    return Dashboard.findById(id).exec();
  Dashboard.findById(id, cb);
  return null;
};

Dashboard.findByUser = (user, cb) => {
  const query = { user };
  if (!cb)
    return Dashboard.find(query).exec();
  Dashboard.find(query, cb);
  return null;
};

Dashboard.findByUserAndDashboardName = (user, dashboardName, populate, cb) => {
  const query = { user, name: dashboardName };
  if (!cb) {
    if (populate)
      return Dashboard.findOne(query).populate('jobs').exec();
    return Dashboard.findOne(query).exec();
  }
  if (populate) {
    Dashboard.findOne(query).populate('jobs').exec(cb);
    return null;
  }
  Dashboard.findOne(query, cb);
  return null;
};

// @deprecated
Dashboard.findByUserAndDashboardNames = (user, dashboardNames, projection, cb) => {
  const query = { user, name: { $in: dashboardNames } };
  if (!projection)
    projection = null;
  if (!cb)
    return Dashboard.find(query, projection).exec();
  Dashboard.find(query, projection, cb);
  return null;
};

Dashboard.deleteById = (id, cb) => {
  if (!cb)
    return Dashboard.findByIdAndDelete(id).exec();
  Dashboard.findByIdAndDelete(id, cb);
  return null;
};

Dashboard.deleteMultiple = (idArr, cb) => {
  const query = { _id: { $in: idArr } };
  if (!cb)
    return Dashboard.deleteMany(query).exec();
  Dashboard.deleteMany(query, cb);
  return null;
};

Dashboard.deleteByName = (user, dashboardName, cb) => {
  const query = { user, name: dashboardName };
  if (!cb)
    return Dashboard.findOneAndDelete(query).exec();
  Dashboard.findOneAndDelete(query, cb);
  return null;
};

module.exports = Dashboard;
