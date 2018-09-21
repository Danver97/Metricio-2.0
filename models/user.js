import urlPaths from '../src/lib/url_paths';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    index: { unique: true },
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  create: {
    type: String,
    default: urlPaths.users.get.create(),
  },
  list: {
    type: String,
    default: urlPaths.users.get.list(),
  },
});

UserSchema.pre('save', function (next) {
  this.delete = urlPaths.dashboard.post.delete(this.name);
  next();
});

UserSchema.pre('update', function (next) {
  this.delete = urlPaths.dashboard.post.delete(this.name);
  next();
});

const User = mongoose.model('User', UserSchema);

User.createUser = (user, cb) => {
  bcrypt.hash(user.password, saltRounds, (err, hash) => {
    if (err && cb) cb(err);
    else if (err) throw err;
    user.password = hash;
    User.create(user, cb);
  });
};

User.changePassword = (user, password, cb) => {
  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) cb(err);
    user.password = hash;
    User.findOneAndUpdate({
      name: user.name,
    }, user, {
      upsert: false,
    }, cb);
  });
};

User.getByName = (name, cb) => {
  if (!cb)
    return User.findOne({ name }).exec();
  User.findOne({ name }, cb);
  return null;
};

User.getById = (id, cb) => {
  if (!cb)
    return User.findById(id).exec();
  User.findById(id, cb);
  return null;
};

User.listById = (idArr, cb) => {
  if (!cb)
    return User.find({ _id: { $in: idArr } }).exec();
  User.find({ _id: { $in: idArr } }, cb);
  return null;
};

User.getAll = (cb) => {
  if (!cb)
    return User.find({}).exec();
  User.find({}, cb);
  return null;
};

User.comparePassword = (candidatePassword, hash, cb) => {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err && !cb) throw err;
    if (cb)
      cb(err, isMatch);
  });
};

User.deleteByName = (name, cb) => {
  const query = { name };
  if (!cb)
    return User.findOneAndDelete(query).exec();
  User.findOneAndDelete(query, cb);
  return null;
};

User.deleteByNames = (nameArr, cb) => {
  const query = { name: { $in: nameArr } };
  if (!cb)
    return User.deleteMany(query).exec();
  User.deleteMany(query, cb);
  return null;
};

module.exports = User;
