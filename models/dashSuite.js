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
    default: '/dashsuites/create',
  },
  list: {
    type: String,
    default: '/dashsuites/list',
  },
});

DashboardSuiteSchema.pre('save', (next) => {
  this.view = '/dashsuites/view/' + this.name;
  this.delete = '/dashsuites/delete/' + this.name;
  next();
});

DashboardSuiteSchema.pre('update', (next) => {
  this.view = '/dashsuites/view/' + this.name;
  this.delete = '/dashsuites/delete/' + this.name;
  next();
});

DashboardSuiteSchema.index({ user: 1, name: 1 }, { unique: true });

const DashboardSuite = mongoose.model('DashboardSuite', DashboardSuiteSchema);

DashboardSuite.create = (dashboard, cb) => {
  const newDash = dashboard.toObject();
  delete newDash._id;
  DashboardSuite.updateOne(
    {
      user: dashboard.user,
      name: dashboard.name,
    },
    newDash, { upsert: true }, cb
  );
  // dashboard.save(cb);
};

DashboardSuite.findByUser = (user, cb) => {
  const query = { user };
  DashboardSuite.find(query, cb);
};

DashboardSuite.findByUserAndDashSuiteName = (user, dashSuiteName, populate, cb) => {
  const query = { user, name: dashSuiteName };
  if(!cb) {
    if(populate)
      return DashboardSuite.findOne(query).populate('dashboards', { layouts: 0 });
    return DashboardSuite.findOne(query);
  } else {
    if(populate){
      DashboardSuite.findOne(query).populate('dashboards', { layouts: 0 }).exec(cb);
      return;
    }
    DashboardSuite.findOne(query, cb);
    
  }
};

module.exports = DashboardSuite;
