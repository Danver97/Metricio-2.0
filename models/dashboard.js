const mongoose = require('mongoose');

// User Schema
const DashboardSchema = mongoose.Schema({
  user: {
    type: String,
  },
  name: {
    type: String,
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
    default: '/dashboard/create',
  },
});

DashboardSchema.pre('save', (next) => {
  this.view = '/dashboard/view/' + this.name;
  this.delete = '/dashboard/delete/' + this.name;
  next();
});

DashboardSchema.pre('update', (next) => {
  this.view = '/dashboard/view/' + this.name;
  this.delete = '/dashboard/delete/' + this.name;
  next();
});

DashboardSchema.index({ user: 1, name: 1 }, { unique: true });

const Dashboard = mongoose.model('Dashboard', DashboardSchema);

Dashboard.create = (dashboard, cb) => {
  const newDash = dashboard.toObject();
  delete newDash._id;
  if(!cb)
    return Dashboard.updateOne({ user: dashboard.user, name: dashboard.name }, newDash, { upsert: true }).exec();
  Dashboard.updateOne({ user: dashboard.user, name: dashboard.name }, newDash, { upsert: true }, cb);
};

Dashboard.findByUser = (user, cb) => {
  const query = { user };
  if(!cb)
    return Dashboard.find(query).exec();
  Dashboard.find(query, cb);
};

Dashboard.findByUserAndDashboardName = (user, dashboardName, cb) => {
  const query = { user, name: dashboardName };
  if(!cb)
    return Dashboard.findOne(query).exec();
  Dashboard.findOne(query, cb);
};

Dashboard.findByUserAndDashboardNames = (user, dashboardNames, projection, cb) => {
  const query = { user, name: {$in: dashboardNames} };
  if(!projection)
    projection = null;
  if(!cb)
    return Dashboard.find(query, projection).exec();
  Dashboard.find(query, projection, cb);
};

module.exports = Dashboard;
