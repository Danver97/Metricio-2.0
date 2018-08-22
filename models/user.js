const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    index: true,
  },
  role: {
    type: String,
  },
  password: {
    type: String,
  },
  create: {
    type: String,
    default: '/users/create',
  },
  list: {
    type: String,
    default: '/users/list',
  },
  delete: {
    type: String,
    default: '/users/delete',
  },
});

const User = mongoose.model('User', UserSchema);

User.create = (user, cb) => {
  bcrypt.hash(user.password, saltRounds, (err, hash) => {
    user.password = hash;
    user.save(cb);
  });
};

User.changePassword = (user, password, cb) => {
  bcrypt.hash(password, saltRounds, (err, hash) => {
    user.password = hash;
    User.findOneAndUpdate({
      name: user.name,
    }, user, {
      upsert: false,
    }, cb);
  });
};

User.getByName = (name, cb) => {
  User.findOne({
    name,
  }, cb);
};

User.getById = (id, cb) => {
  User.findById(id, cb);
};

User.comparePassword = (candidatePassword, hash, cb) => {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) throw err;
    if(cb)
      cb(null, isMatch);
  });
};

module.exports = User;
